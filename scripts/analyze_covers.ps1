$jsonPath = "scripts\covers_ocr_data.json"
$data = Get-Content $jsonPath -Raw | ConvertFrom-Json

Write-Host "Total files: $($data.Count)"
$hashGroups = $data | Group-Object Hash
Write-Host "Unique hashes: $($hashGroups.Count)"

$exactDupes = @()
foreach ($g in $hashGroups) {
    if ($g.Count -gt 1) {
        $keep = $g.Group[0].FileName
        $dupes = $g.Group | Select-Object -Skip 1
        foreach ($d in $dupes) {
            $exactDupes += [PSCustomObject]@{
                Duplicate = $d.FileName
                Original  = $keep
                Hash      = $g.Name
            }
        }
    }
}

Write-Host "Exact binary duplicates count: $($exactDupes.Count)"
$exactDupes | Format-Table -AutoSize

Write-Host "`n--- Unique Images and Extracted Text ---"
$uniqueImages = foreach ($g in $hashGroups) {
    $item = $g.Group[0]
    [PSCustomObject]@{
        FileName = $item.FileName
        Size     = $item.Size
        Width    = $item.Width
        Height   = $item.Height
        Text     = ($item.Text -replace "`r?`n", " -- ")
    }
}

$uniqueImages | Format-List FileName, Size, Width, Height, Text
