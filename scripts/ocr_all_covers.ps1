Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod
} | Select-Object -First 1

function Await($asyncOp, [Type]$type) {
    $method = $asTaskGeneric.MakeGenericMethod($type)
    $task = $method.Invoke($null, @($asyncOp))
    $task.Wait(-1) | Out-Null
    return $task.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
}

$files = Get-ChildItem -Path "public\images\covers" -Filter "*.jpeg"
$results = @()

foreach ($file in $files) {
    $hash = (Get-FileHash -Path $file.FullName -Algorithm SHA256).Hash
    
    try {
        $fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName)
        $storageFile = Await $fileOp ([Windows.Storage.StorageFile])

        $streamOp = $storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)
        $stream = Await $streamOp ([Windows.Storage.Streams.IRandomAccessStream])

        $decoderOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
        $decoder = Await $decoderOp ([Windows.Graphics.Imaging.BitmapDecoder])

        $width = $decoder.PixelWidth
        $height = $decoder.PixelHeight

        $bitmapOp = $decoder.GetSoftwareBitmapAsync()
        $bitmap = Await $bitmapOp ([Windows.Graphics.Imaging.SoftwareBitmap])

        $ocrOp = $engine.RecognizeAsync($bitmap)
        $ocrResult = Await $ocrOp ([Windows.Media.Ocr.OcrResult])

        $lines = @()
        foreach ($line in $ocrResult.Lines) {
            $lines += $line.Text
        }

        $results += [PSCustomObject]@{
            FileName = $file.Name
            Size     = $file.Length
            Width    = $width
            Height   = $height
            Hash     = $hash
            Text     = $ocrResult.Text
            Lines    = $lines
        }
    } catch {
        Write-Warning "Failed to process $($file.Name): $_"
        $results += [PSCustomObject]@{
            FileName = $file.Name
            Size     = $file.Length
            Hash     = $hash
            Error    = $_.ToString()
        }
    }
}

$jsonPath = "scripts\covers_ocr_data.json"
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding utf8
Write-Host "Processed $($results.Count) files. Saved to $jsonPath"
