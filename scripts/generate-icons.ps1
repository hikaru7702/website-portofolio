# Membuat ikon PWA dan gambar Open Graph secara lokal.
# Jalankan dari root proyek: powershell -ExecutionPolicy Bypass -File scripts/generate-icons.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root "public\icons"
New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null

function New-RoundedPath {
    param([int]$Width, [int]$Height, [double]$Radius)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = [Math]::Max(2, [int]($Radius * 2))
    $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
    $path.AddArc($Width - $diameter, 0, $diameter, $diameter, 270, 90)
    $path.AddArc($Width - $diameter, $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc(0, $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-AppIcon {
    param(
        [int]$Size,
        [string]$OutputPath,
        [switch]$FullBleed,
        [switch]$Maskable
    )

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $startColor = [System.Drawing.Color]::FromArgb(255, 79, 70, 229)
    $endColor = [System.Drawing.Color]::FromArgb(255, 168, 85, 247)

    if ($FullBleed) {
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $startColor, $endColor, 45)
        $graphics.FillRectangle($brush, $rect)
        $brush.Dispose()
    }
    else {
        $rounded = New-RoundedPath -Width $Size -Height $Size -Radius ($Size * 0.22)
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $startColor, $endColor, 45)
        $graphics.FillPath($brush, $rounded)
        $brush.Dispose()
        $rounded.Dispose()
    }

    $highlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(38, 255, 255, 255))
    $graphics.FillEllipse($highlightBrush, [int]($Size * 0.55), [int](-$Size * 0.18), [int]($Size * 0.72), [int]($Size * 0.72))
    $graphics.FillEllipse($highlightBrush, [int](-$Size * 0.28), [int]($Size * 0.58), [int]($Size * 0.72), [int]($Size * 0.72))
    $highlightBrush.Dispose()

    $fontSize = if ($Maskable) { $Size * 0.38 } else { $Size * 0.46 }
    $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

    $graphics.DrawString("K", $font, $textBrush, (New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)), $stringFormat)

    $textBrush.Dispose()
    $stringFormat.Dispose()
    $font.Dispose()
    $graphics.Dispose()

    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
}

New-AppIcon -Size 192 -OutputPath (Join-Path $iconsDir "192.png")
New-AppIcon -Size 512 -OutputPath (Join-Path $iconsDir "512.png")
New-AppIcon -Size 512 -OutputPath (Join-Path $iconsDir "maskable.png") -FullBleed -Maskable
New-AppIcon -Size 180 -OutputPath (Join-Path $iconsDir "apple-touch-icon.png") -FullBleed

# Open Graph image 1200 x 630
$ogWidth = 1200
$ogHeight = 630
$og = New-Object System.Drawing.Bitmap($ogWidth, $ogHeight)
$ogGraphics = [System.Drawing.Graphics]::FromImage($og)
$ogGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$ogGraphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$ogRect = New-Object System.Drawing.Rectangle(0, 0, $ogWidth, $ogHeight)
$ogStart = [System.Drawing.Color]::FromArgb(255, 12, 12, 20)
$ogEnd = [System.Drawing.Color]::FromArgb(255, 49, 32, 95)
$ogBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($ogRect, $ogStart, $ogEnd, 35)
$ogGraphics.FillRectangle($ogBrush, $ogRect)
$ogBrush.Dispose()

$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 255, 255, 255), 1)
for ($x = 0; $x -le $ogWidth; $x += 60) {
    $ogGraphics.DrawLine($gridPen, $x, 0, $x, $ogHeight)
}
for ($y = 0; $y -le $ogHeight; $y += 60) {
    $ogGraphics.DrawLine($gridPen, 0, $y, $ogWidth, $y)
}
$gridPen.Dispose()

$glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 129, 140, 248))
$ogGraphics.FillEllipse($glowBrush, 760, -180, 620, 620)
$glowBrush.Dispose()
$pinkGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 232, 121, 249))
$ogGraphics.FillEllipse($pinkGlow, 860, 300, 420, 420)
$pinkGlow.Dispose()

$accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 165, 180, 252))
$accentFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$ogGraphics.DrawString("PERSONAL PORTFOLIO", $accentFont, $accentBrush, 90, 82)
$accentBrush.Dispose()
$accentFont.Dispose()

$titleFont = New-Object System.Drawing.Font("Segoe UI", 96, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$ogGraphics.DrawString("Kaffah.", $titleFont, $titleBrush, 82, 150)
$titleBrush.Dispose()
$titleFont.Dispose()

$subtitleFont = New-Object System.Drawing.Font("Segoe UI", 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$subtitleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 228, 228, 231))
$ogGraphics.DrawString("Web Developer / Interactive Portfolio", $subtitleFont, $subtitleBrush, 90, 275)
$subtitleBrush.Dispose()
$subtitleFont.Dispose()

$tagFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$tagTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$tagFillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 255, 255))
$tagBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(95, 255, 255, 255), 1)

$tags = @("React", "Next.js", "TypeScript", "Tailwind CSS")
$tagX = 90
$tagTop = 430
foreach ($tag in $tags) {
    $tagSize = $ogGraphics.MeasureString($tag, $tagFont)
    $tagWidth = [int]($tagSize.Width + 34)
    $tagHeight = 44
    $tagPath = New-RoundedPath -Width $tagWidth -Height $tagHeight -Radius 22
    $tagMatrix = New-Object System.Drawing.Drawing2D.Matrix
    $tagMatrix.Translate($tagX, $tagTop)
    $tagPath.Transform($tagMatrix)
    $ogGraphics.FillPath($tagFillBrush, $tagPath)
    $ogGraphics.DrawPath($tagBorderPen, $tagPath)
    $textY = $tagTop + (($tagHeight - $tagSize.Height) / 2)
    $ogGraphics.DrawString($tag, $tagFont, $tagTextBrush, ($tagX + 17), $textY)
    $tagMatrix.Dispose()
    $tagPath.Dispose()
    $tagX += $tagWidth + 14
}

$tagFillBrush.Dispose()
$tagBorderPen.Dispose()
$tagTextBrush.Dispose()
$tagFont.Dispose()

$footerFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$footerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 212, 212, 216))
$ogGraphics.DrawString("Dibangun dengan Next.js / Tailwind CSS / PWA", $footerFont, $footerBrush, 90, 535)
$footerBrush.Dispose()
$footerFont.Dispose()

$ogGraphics.Dispose()
$og.Save((Join-Path $root "public\og-image.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$og.Dispose()

# Favicon 64 x 64 untuk menghindari permintaan /favicon.ico yang gagal.
$appDir = Join-Path $root "src\app"
New-Item -ItemType Directory -Path $appDir -Force | Out-Null
$faviconSource = Join-Path $env:TEMP "portfolio-favicon-64.png"
New-AppIcon -Size 64 -OutputPath $faviconSource -FullBleed

$faviconBitmap = [System.Drawing.Bitmap]::FromFile($faviconSource)
$faviconIcon = [System.Drawing.Icon]::FromHandle($faviconBitmap.GetHicon())
$faviconStream = [System.IO.File]::Create((Join-Path $appDir "favicon.ico"))
$faviconIcon.Save($faviconStream)
$faviconStream.Close()
$faviconIcon.Dispose()
$faviconBitmap.Dispose()
Remove-Item $faviconSource -Force

Write-Host "Ikon PWA, favicon, dan og-image.png berhasil dibuat."
