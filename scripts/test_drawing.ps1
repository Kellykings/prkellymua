Add-Type -AssemblyName System.Drawing

$file = Get-Item "public\images\covers\WhatsApp Image 2026-11-10 at 4.26.22 PM.jpeg"
$bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"
$bmp.Dispose()
