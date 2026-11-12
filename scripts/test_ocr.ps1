[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if ($null -ne $engine) {
    Write-Host "Windows OCR Engine available: $($engine.RecognizerLanguage.LanguageTag)"
} else {
    Write-Host "Windows OCR Engine not available"
}
