Add-Type -AssemblyName System.Drawing

function Get-DHash($filePath) {
    $img = [System.Drawing.Image]::FromFile($filePath)
    $bmp = New-Object System.Drawing.Bitmap(9, 8, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
    $g.DrawImage($img, 0, 0, 9, 8)
    $g.Dispose()
    $img.Dispose()

    $bits = ""
    for ($y = 0; $y -lt 8; $y++) {
        for ($x = 0; $x -lt 8; $x++) {
            $p1 = $bmp.GetPixel($x, $y)
            $p2 = $bmp.GetPixel($x + 1, $y)
            $gray1 = [int](0.299 * $p1.R + 0.587 * $p1.G + 0.114 * $p1.B)
            $gray2 = [int](0.299 * $p2.R + 0.587 * $p2.G + 0.114 * $p2.B)
            if ($gray1 -gt $gray2) { $bits += "1" } else { $bits += "0" }
        }
    }
    $bmp.Dispose()
    return $bits
}

function Get-HammingDistance($h1, $h2) {
    $dist = 0
    for ($i = 0; $i -lt $h1.Length; $i++) {
        if ($h1[$i] -ne $h2[$i]) { $dist++ }
    }
    return $dist
}

$files = Get-ChildItem -Path "public\images\covers" -Filter "*.jpeg"
$hashes = @()

foreach ($f in $files) {
    $dhash = Get-DHash $f.FullName
    $fileHash = (Get-FileHash -Path $f.FullName -Algorithm SHA256).Hash
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $w = $img.Width
    $h = $img.Height
    $img.Dispose()

    $hashes += [PSCustomObject]@{
        Name     = $f.Name
        FullPath = $f.FullName
        Size     = $f.Length
        Width    = $w
        Height   = $h
        SHA256   = $fileHash
        DHash    = $dhash
    }
}

Write-Host "Total files processed: $($hashes.Count)"

# Cluster by perceptual similarity
$clusters = @()
$assigned = @{}

for ($i = 0; $i -lt $hashes.Count; $i++) {
    $itemA = $hashes[$i]
    if ($assigned.ContainsKey($itemA.Name)) { continue }

    $cluster = @($itemA)
    $assigned[$itemA.Name] = $true

    for ($j = $i + 1; $j -lt $hashes.Count; $j++) {
        $itemB = $hashes[$j]
        if ($assigned.ContainsKey($itemB.Name)) { continue }

        $dist = Get-HammingDistance $itemA.DHash $itemB.DHash
        # If identical dhash or very close distance (<= 2) and same aspect ratio
        $arA = [math]::Round($itemA.Width / [double]$itemA.Height, 2)
        $arB = [math]::Round($itemB.Width / [double]$itemB.Height, 2)

        if ($dist -le 2 -and [math]::Abs($arA - $arB) -lt 0.05) {
            $cluster += $itemB
            $assigned[$itemB.Name] = $true
        }
    }
    $clusters += ,$cluster
}

Write-Host "Total unique visual clusters: $($clusters.Count)"

$clusterReport = @()
for ($c = 0; $c -lt $clusters.Count; $c++) {
    $group = $clusters[$c]
    # Pick highest resolution / largest size as best
    $sorted = $group | Sort-Object -Property @{Expression = { $_.Width * $_.Height }; Descending = $true}, @{Expression = { $_.Size }; Descending = $true}
    $best = $sorted[0]
    $dupes = $sorted | Select-Object -Skip 1

    $clusterReport += [PSCustomObject]@{
        ClusterIndex = $c + 1
        Keep         = $best.Name
        Resolution   = "$($best.Width)x$($best.Height)"
        Size         = $best.Size
        DuplicateCount = $dupes.Count
        Duplicates   = ($dupes | ForEach-Object { $_.Name }) -join '; '
    }
}

$clusterReport | Format-Table -AutoSize
$clusterReport | ConvertTo-Json -Depth 5 | Set-Content "scripts\duplicate_clusters.json" -Encoding utf8
