# Membuat gambar cover proyek secara lokal agar tidak bergantung pada layanan gambar eksternal.
# Jalankan dari root proyek: powershell -ExecutionPolicy Bypass -File scripts/generate-covers.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root "public\images\projects"
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

function Get-Color {
    param([string]$Hex, [int]$Alpha = 255)

    $value = $Hex.TrimStart("#")
    $r = [Convert]::ToInt32($value.Substring(0, 2), 16)
    $g = [Convert]::ToInt32($value.Substring(2, 2), 16)
    $b = [Convert]::ToInt32($value.Substring(4, 2), 16)
    return [System.Drawing.Color]::FromArgb($Alpha, $r, $g, $b)
}

function New-RoundedPath {
    param([single]$X, [single]$Y, [single]$Width, [single]$Height, [single]$Radius)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = [Math]::Min($Radius * 2, [Math]::Min($Width, $Height))
    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function Draw-Box {
    param(
        $Graphics,
        [single]$X,
        [single]$Y,
        [single]$Width,
        [single]$Height,
        [single]$Radius,
        $FillColor,
        $BorderColor = $null,
        [single]$BorderWidth = 1
    )

    $path = New-RoundedPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
    if ($null -ne $FillColor) {
        $brush = New-Object System.Drawing.SolidBrush($FillColor)
        $Graphics.FillPath($brush, $path)
        $brush.Dispose()
    }
    if ($null -ne $BorderColor) {
        $pen = New-Object System.Drawing.Pen($BorderColor, $BorderWidth)
        $Graphics.DrawPath($pen, $path)
        $pen.Dispose()
    }
    $path.Dispose()
}

function Draw-GradientBox {
    param(
        $Graphics,
        [single]$X,
        [single]$Y,
        [single]$Width,
        [single]$Height,
        [single]$Radius,
        $Color1,
        $Color2,
        [single]$Angle = 45
    )

    $path = New-RoundedPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
    $rect = New-Object System.Drawing.RectangleF($X, $Y, $Width, $Height)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $Color1, $Color2, $Angle)
    $Graphics.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
}

function Draw-Line {
    param(
        $Graphics,
        [single]$X,
        [single]$Y,
        [single]$Width,
        [single]$Height,
        $Color
    )

    Draw-Box -Graphics $Graphics -X $X -Y $Y -Width $Width -Height $Height -Radius ($Height / 2) -FillColor $Color
}

function Draw-Text {
    param(
        $Graphics,
        [string]$Text,
        [single]$X,
        [single]$Y,
        [single]$Size,
        $Color,
        [switch]$Bold,
        [string]$Family = "Segoe UI"
    )

    $style = if ($Bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    $font = New-Object System.Drawing.Font($Family, $Size, $style, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush($Color)
    $Graphics.DrawString($Text, $font, $brush, $X, $Y)
    $brush.Dispose()
    $font.Dispose()
}

function Draw-CenteredText {
    param(
        $Graphics,
        [string]$Text,
        [single]$X,
        [single]$Y,
        [single]$Width,
        [single]$Height,
        [single]$Size,
        $Color,
        [switch]$Bold
    )

    $style = if ($Bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    $font = New-Object System.Drawing.Font("Segoe UI", $Size, $style, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush($Color)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF($X, $Y, $Width, $Height)
    $Graphics.DrawString($Text, $font, $brush, $rect, $format)
    $format.Dispose()
    $brush.Dispose()
    $font.Dispose()
}

function Draw-Window {
    param($Graphics, $Cover)

    $white = [System.Drawing.Color]::White
    Draw-Box -Graphics $Graphics -X 90 -Y 150 -Width 1020 -Height 510 -Radius 26 -FillColor (Get-Color "#ffffff" 18) -BorderColor (Get-Color "#ffffff" 46) -BorderWidth 1
    Draw-Box -Graphics $Graphics -X 90 -Y 150 -Width 1020 -Height 54 -Radius 26 -FillColor (Get-Color "#ffffff" 12)
    $Graphics.DrawLine((New-Object System.Drawing.Pen((Get-Color "#ffffff" 30), 1)), 90, 204, 1110, 204)

    $dots = @("#f87171", "#fbbf24", "#34d399")
    for ($i = 0; $i -lt $dots.Count; $i++) {
        $brush = New-Object System.Drawing.SolidBrush((Get-Color $dots[$i] 230))
        $Graphics.FillEllipse($brush, 120 + ($i * 22), 174, 9, 9)
        $brush.Dispose()
    }

    Draw-Box -Graphics $Graphics -X 202 -Y 162 -Width 330 -Height 30 -Radius 15 -FillColor (Get-Color "#ffffff" 22) -BorderColor (Get-Color "#ffffff" 20)
    Draw-Text -Graphics $Graphics -Text "project.local / case-study" -X 218 -Y 169 -Size 12 -Color (Get-Color "#ffffff" 150)
    Draw-Box -Graphics $Graphics -X 1030 -Y 164 -Width 54 -Height 26 -Radius 13 -FillColor (Get-Color $Cover.Accent 170)
    Draw-Text -Graphics $Graphics -Text "LIVE" -X 1042 -Y 170 -Size 10 -Color (Get-Color "#ffffff" 230) -Bold

    Draw-Text -Graphics $Graphics -Text ("CASE STUDY  /  " + $Cover.Number.ToString("00")) -X 70 -Y 58 -Size 15 -Color (Get-Color $Cover.Accent 230) -Bold
    Draw-Text -Graphics $Graphics -Text $Cover.Type -X 70 -Y 86 -Size 12 -Color (Get-Color "#ffffff" 125)
    Draw-Text -Graphics $Graphics -Text "PORTFOLIO  /  2026" -X 937 -Y 92 -Size 11 -Color (Get-Color "#ffffff" 100)
}

function Draw-CommerceContent {
    param($Graphics, $Cover)

    Draw-Line -Graphics $Graphics -X 120 -Y 238 -Width 104 -Height 12 -Color (Get-Color $Cover.Accent 235)
    Draw-Line -Graphics $Graphics -X 946 -Y 234 -Width 60 -Height 10 -Color (Get-Color "#ffffff" 70)
    Draw-Line -Graphics $Graphics -X 1018 -Y 234 -Width 42 -Height 10 -Color (Get-Color "#ffffff" 70)

    Draw-GradientBox -Graphics $Graphics -X 120 -Y 276 -Width 460 -Height 172 -Radius 20 -Color1 (Get-Color $Cover.Accent 230) -Color2 (Get-Color $Cover.Secondary 220)
    Draw-Text -Graphics $Graphics -Text "NEW COLLECTION" -X 148 -Y 302 -Size 13 -Color (Get-Color "#ffffff" 180) -Bold
    Draw-Line -Graphics $Graphics -X 148 -Y 330 -Width 250 -Height 22 -Color (Get-Color "#ffffff" 235)
    Draw-Line -Graphics $Graphics -X 148 -Y 362 -Width 170 -Height 12 -Color (Get-Color "#ffffff" 155)
    Draw-Box -Graphics $Graphics -X 148 -Y 396 -Width 112 -Height 32 -Radius 16 -FillColor (Get-Color "#ffffff" 235)
    Draw-Text -Graphics $Graphics -Text "Shop now" -X 168 -Y 404 -Size 12 -Color (Get-Color "#111827" 240) -Bold

    Draw-Box -Graphics $Graphics -X 610 -Y 276 -Width 470 -Height 172 -Radius 20 -FillColor (Get-Color "#ffffff" 14) -BorderColor (Get-Color "#ffffff" 38)
    Draw-Text -Graphics $Graphics -Text "TRENDING" -X 636 -Y 298 -Size 11 -Color (Get-Color "#ffffff" 130) -Bold
    Draw-Line -Graphics $Graphics -X 636 -Y 326 -Width 200 -Height 14 -Color (Get-Color "#ffffff" 190)
    Draw-Line -Graphics $Graphics -X 636 -Y 350 -Width 280 -Height 9 -Color (Get-Color "#ffffff" 95)
    Draw-Line -Graphics $Graphics -X 636 -Y 368 -Width 230 -Height 9 -Color (Get-Color "#ffffff" 95)
    Draw-Box -Graphics $Graphics -X 636 -Y 398 -Width 80 -Height 26 -Radius 13 -FillColor (Get-Color $Cover.Accent 170)
    Draw-Text -Graphics $Graphics -Text "View" -X 658 -Y 404 -Size 10 -Color (Get-Color "#ffffff" 230) -Bold

    $cardX = @(120, 450, 780)
    for ($i = 0; $i -lt 3; $i++) {
        $x = $cardX[$i]
        Draw-Box -Graphics $Graphics -X $x -Y 476 -Width 300 -Height 154 -Radius 18 -FillColor (Get-Color "#ffffff" 12) -BorderColor (Get-Color "#ffffff" 32)
        Draw-GradientBox -Graphics $Graphics -X ($x + 12) -Y 488 -Width 276 -Height 70 -Radius 12 -Color1 (Get-Color $Cover.Accent (170 + ($i * 20))) -Color2 (Get-Color $Cover.Secondary 150)
        Draw-Line -Graphics $Graphics -X ($x + 16) -Y 574 -Width (150 + ($i * 22)) -Height 10 -Color (Get-Color "#ffffff" 165)
        Draw-Line -Graphics $Graphics -X ($x + 16) -Y 594 -Width 92 -Height 8 -Color (Get-Color "#ffffff" 85)
        Draw-Text -Graphics $Graphics -Text ("Rp " + (149 + ($i * 120)) + ".000") -X ($x + 16) -Y 607 -Size 10 -Color (Get-Color $Cover.Accent 220) -Bold
    }
}

function Draw-KanbanContent {
    param($Graphics, $Cover)

    Draw-Line -Graphics $Graphics -X 120 -Y 238 -Width 112 -Height 12 -Color (Get-Color "#ffffff" 200)
    Draw-Line -Graphics $Graphics -X 984 -Y 234 -Width 74 -Height 10 -Color (Get-Color "#ffffff" 80)

    $columns = @(
        @{ X = 120; Title = "Backlog"; Count = "4"; Accent = $Cover.Accent },
        @{ X = 450; Title = "In progress"; Count = "3"; Accent = $Cover.Secondary },
        @{ X = 780; Title = "Done"; Count = "6"; Accent = "#34d399" }
    )

    foreach ($column in $columns) {
        Draw-Box -Graphics $Graphics -X $column.X -Y 270 -Width 300 -Height 360 -Radius 18 -FillColor (Get-Color "#ffffff" 10) -BorderColor (Get-Color "#ffffff" 28)
        Draw-Line -Graphics $Graphics -X ($column.X + 20) -Y 292 -Width 8 -Height 8 -Color (Get-Color $column.Accent 230)
        Draw-Text -Graphics $Graphics -Text $column.Title -X ($column.X + 36) -Y 288 -Size 12 -Color (Get-Color "#ffffff" 190) -Bold
        Draw-Box -Graphics $Graphics -X ($column.X + 248) -Y 286 -Width 30 -Height 20 -Radius 10 -FillColor (Get-Color "#ffffff" 24)
        Draw-CenteredText -Graphics $Graphics -Text $column.Count -X ($column.X + 248) -Y 286 -Width 30 -Height 20 -Size 9 -Color (Get-Color "#ffffff" 170)

        for ($card = 0; $card -lt 2; $card++) {
            $y = 328 + ($card * 132)
            Draw-Box -Graphics $Graphics -X ($column.X + 16) -Y $y -Width 268 -Height 112 -Radius 14 -FillColor (Get-Color "#ffffff" 18) -BorderColor (Get-Color "#ffffff" 22)
            Draw-Box -Graphics $Graphics -X ($column.X + 30) -Y ($y + 18) -Width 56 -Height 16 -Radius 8 -FillColor (Get-Color $column.Accent 160)
            Draw-Line -Graphics $Graphics -X ($column.X + 30) -Y ($y + 48) -Width (160 + ($card * 24)) -Height 10 -Color (Get-Color "#ffffff" 180)
            Draw-Line -Graphics $Graphics -X ($column.X + 30) -Y ($y + 68) -Width 128 -Height 8 -Color (Get-Color "#ffffff" 80)
            Draw-Box -Graphics $Graphics -X ($column.X + 30) -Y ($y + 86) -Width 44 -Height 12 -Radius 6 -FillColor (Get-Color "#ffffff" 30)
            Draw-Box -Graphics $Graphics -X ($column.X + 82) -Y ($y + 86) -Width 34 -Height 12 -Radius 6 -FillColor (Get-Color "#ffffff" 22)
            $Graphics.FillEllipse((New-Object System.Drawing.SolidBrush((Get-Color $Cover.Secondary 220))), $column.X + 240, $y + 82, 18, 18)
        }
    }
}

function Draw-PortfolioContent {
    param($Graphics, $Cover)

    Draw-GradientBox -Graphics $Graphics -X 140 -Y 272 -Width 260 -Height 260 -Radius 64 -Color1 (Get-Color $Cover.Accent 240) -Color2 (Get-Color $Cover.Secondary 230)
    Draw-CenteredText -Graphics $Graphics -Text "K" -X 140 -Y 272 -Width 260 -Height 260 -Size 128 -Color (Get-Color "#ffffff" 245) -Bold
    Draw-Box -Graphics $Graphics -X 356 -Y 500 -Width 76 -Height 30 -Radius 15 -FillColor (Get-Color "#ffffff" 230)
    Draw-Text -Graphics $Graphics -Text "OPEN TO WORK" -X 362 -Y 509 -Size 8 -Color (Get-Color "#1e1b4b" 235) -Bold

    Draw-Line -Graphics $Graphics -X 450 -Y 282 -Width 112 -Height 10 -Color (Get-Color $Cover.Accent 220)
    Draw-Line -Graphics $Graphics -X 450 -Y 314 -Width 506 -Height 26 -Color (Get-Color "#ffffff" 225)
    Draw-Line -Graphics $Graphics -X 450 -Y 354 -Width 392 -Height 26 -Color (Get-Color "#ffffff" 225)
    Draw-Line -Graphics $Graphics -X 450 -Y 402 -Width 454 -Height 10 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 450 -Y 422 -Width 386 -Height 10 -Color (Get-Color "#ffffff" 100)

    Draw-Box -Graphics $Graphics -X 450 -Y 456 -Width 142 -Height 40 -Radius 20 -FillColor (Get-Color $Cover.Accent 235)
    Draw-Text -Graphics $Graphics -Text "View projects" -X 476 -Y 468 -Size 11 -Color (Get-Color "#ffffff" 240) -Bold
    Draw-Box -Graphics $Graphics -X 606 -Y 456 -Width 124 -Height 40 -Radius 20 -FillColor (Get-Color "#ffffff" 10) -BorderColor (Get-Color "#ffffff" 100)
    Draw-Text -Graphics $Graphics -Text "Contact" -X 632 -Y 468 -Size 11 -Color (Get-Color "#ffffff" 210) -Bold

    Draw-Box -Graphics $Graphics -X 450 -Y 522 -Width 610 -Height 96 -Radius 16 -FillColor (Get-Color "#000000" 110) -BorderColor (Get-Color "#ffffff" 34)
    Draw-Line -Graphics $Graphics -X 474 -Y 544 -Width 8 -Height 8 -Color (Get-Color "#f87171" 210)
    Draw-Line -Graphics $Graphics -X 490 -Y 544 -Width 8 -Height 8 -Color (Get-Color "#fbbf24" 210)
    Draw-Line -Graphics $Graphics -X 506 -Y 544 -Width 8 -Height 8 -Color (Get-Color "#34d399" 210)
    Draw-Text -Graphics $Graphics -Text "const developer = {" -X 474 -Y 564 -Size 11 -Color (Get-Color $Cover.Secondary 225)
    Draw-Text -Graphics $Graphics -Text "  stack: ['React', 'Next.js', 'TypeScript']" -X 474 -Y 582 -Size 11 -Color (Get-Color "#ffffff" 150)
    Draw-Text -Graphics $Graphics -Text "}" -X 474 -Y 600 -Size 11 -Color (Get-Color $Cover.Secondary 225)
}

function Draw-DashboardContent {
    param($Graphics, $Cover)

    Draw-Box -Graphics $Graphics -X 120 -Y 236 -Width 160 -Height 394 -Radius 18 -FillColor (Get-Color "#ffffff" 10) -BorderColor (Get-Color "#ffffff" 26)
    Draw-GradientBox -Graphics $Graphics -X 140 -Y 256 -Width 30 -Height 30 -Radius 9 -Color1 (Get-Color $Cover.Accent 240) -Color2 (Get-Color $Cover.Secondary 220)
    Draw-Line -Graphics $Graphics -X 182 -Y 263 -Width 70 -Height 10 -Color (Get-Color "#ffffff" 170)
    $menuY = @(324, 356, 388, 420, 452)
    for ($i = 0; $i -lt $menuY.Count; $i++) {
        Draw-Box -Graphics $Graphics -X 140 -Y $menuY[$i] -Width 14 -Height 14 -Radius 4 -FillColor (Get-Color $Cover.Accent (100 + ($i * 20)))
        Draw-Line -Graphics $Graphics -X 166 -Y ($menuY[$i] + 3) -Width (82 - ($i * 6)) -Height 8 -Color (Get-Color "#ffffff" (90 + ($i * 10)))
    }

    $kpiX = @(310, 500, 690, 880)
    $kpiValues = @("12.4K", "8.2K", "96%", "4.8")
    for ($i = 0; $i -lt 4; $i++) {
        Draw-Box -Graphics $Graphics -X $kpiX[$i] -Y 236 -Width 170 -Height 92 -Radius 16 -FillColor (Get-Color "#ffffff" 12) -BorderColor (Get-Color "#ffffff" 26)
        Draw-Line -Graphics $Graphics -X ($kpiX[$i] + 18) -Y 256 -Width 62 -Height 8 -Color (Get-Color "#ffffff" 95)
        Draw-Text -Graphics $Graphics -Text $kpiValues[$i] -X ($kpiX[$i] + 18) -Y 276 -Size 24 -Color (Get-Color "#ffffff" 220) -Bold
        Draw-Line -Graphics $Graphics -X ($kpiX[$i] + 18) -Y 306 -Width 44 -Height 6 -Color (Get-Color $Cover.Accent 180)
    }

    Draw-Box -Graphics $Graphics -X 310 -Y 348 -Width 330 -Height 282 -Radius 18 -FillColor (Get-Color "#ffffff" 10) -BorderColor (Get-Color "#ffffff" 24)
    Draw-Text -Graphics $Graphics -Text "Weekly overview" -X 332 -Y 368 -Size 13 -Color (Get-Color "#ffffff" 190) -Bold
    Draw-Line -Graphics $Graphics -X 332 -Y 392 -Width 94 -Height 7 -Color (Get-Color "#ffffff" 70)

    $heights = @(54, 86, 68, 120, 96, 150, 126)
    for ($i = 0; $i -lt $heights.Count; $i++) {
        $barX = 344 + ($i * 40)
        $barY = 602 - $heights[$i]
        Draw-GradientBox -Graphics $Graphics -X $barX -Y $barY -Width 22 -Height $heights[$i] -Radius 8 -Color1 (Get-Color $Cover.Accent 230) -Color2 (Get-Color $Cover.Secondary 150)
    }
    $Graphics.DrawLine((New-Object System.Drawing.Pen((Get-Color "#ffffff" 32), 1)), 332, 604, 618, 604)

    Draw-Box -Graphics $Graphics -X 660 -Y 348 -Width 390 -Height 282 -Radius 18 -FillColor (Get-Color "#ffffff" 10) -BorderColor (Get-Color "#ffffff" 24)
    Draw-Text -Graphics $Graphics -Text "Engagement" -X 682 -Y 368 -Size 13 -Color (Get-Color "#ffffff" 190) -Bold
    Draw-Line -Graphics $Graphics -X 682 -Y 392 -Width 80 -Height 7 -Color (Get-Color "#ffffff" 70)
    for ($i = 0; $i -lt 4; $i++) {
        $Graphics.DrawLine((New-Object System.Drawing.Pen((Get-Color "#ffffff" 22), 1)), 682, 430 + ($i * 42), 1028, 430 + ($i * 42))
    }
    [System.Drawing.PointF[]]$points = @(
        (New-Object System.Drawing.PointF(682, 560)),
        (New-Object System.Drawing.PointF(742, 520)),
        (New-Object System.Drawing.PointF(802, 536)),
        (New-Object System.Drawing.PointF(862, 464)),
        (New-Object System.Drawing.PointF(922, 486)),
        (New-Object System.Drawing.PointF(982, 424)),
        (New-Object System.Drawing.PointF(1028, 446))
    )
    $linePen = New-Object System.Drawing.Pen((Get-Color $Cover.Accent 235), 3)
    $Graphics.DrawLines($linePen, $points)
    $linePen.Dispose()
    foreach ($point in $points) {
        $brush = New-Object System.Drawing.SolidBrush((Get-Color "#ffffff" 220))
        $Graphics.FillEllipse($brush, $point.X - 4, $point.Y - 4, 8, 8)
        $brush.Dispose()
    }
}

function Draw-MobileContent {
    param($Graphics, $Cover)

    Draw-Line -Graphics $Graphics -X 120 -Y 280 -Width 96 -Height 10 -Color (Get-Color $Cover.Accent 230)
    Draw-Line -Graphics $Graphics -X 120 -Y 310 -Width 448 -Height 28 -Color (Get-Color "#ffffff" 220)
    Draw-Line -Graphics $Graphics -X 120 -Y 350 -Width 342 -Height 28 -Color (Get-Color "#ffffff" 220)
    Draw-Line -Graphics $Graphics -X 120 -Y 400 -Width 420 -Height 9 -Color (Get-Color "#ffffff" 90)
    Draw-Line -Graphics $Graphics -X 120 -Y 420 -Width 350 -Height 9 -Color (Get-Color "#ffffff" 90)

    Draw-Box -Graphics $Graphics -X 120 -Y 468 -Width 206 -Height 122 -Radius 18 -FillColor (Get-Color "#ffffff" 12) -BorderColor (Get-Color "#ffffff" 30)
    Draw-Text -Graphics $Graphics -Text "12" -X 142 -Y 488 -Size 30 -Color (Get-Color $Cover.Accent 235) -Bold
    Draw-Line -Graphics $Graphics -X 142 -Y 536 -Width 74 -Height 8 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 142 -Y 552 -Width 108 -Height 6 -Color (Get-Color "#ffffff" 55)

    Draw-Box -Graphics $Graphics -X 350 -Y 468 -Width 206 -Height 122 -Radius 18 -FillColor (Get-Color "#ffffff" 12) -BorderColor (Get-Color "#ffffff" 30)
    Draw-Text -Graphics $Graphics -Text "4.9" -X 372 -Y 488 -Size 30 -Color (Get-Color $Cover.Secondary 235) -Bold
    Draw-Line -Graphics $Graphics -X 372 -Y 536 -Width 88 -Height 8 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 372 -Y 552 -Width 72 -Height 6 -Color (Get-Color "#ffffff" 55)

    Draw-Box -Graphics $Graphics -X 790 -Y 212 -Width 260 -Height 402 -Radius 38 -FillColor (Get-Color "#0b0b12" 245) -BorderColor (Get-Color "#ffffff" 60) -BorderWidth 2
    Draw-GradientBox -Graphics $Graphics -X 802 -Y 224 -Width 236 -Height 378 -Radius 30 -Color1 (Get-Color $Cover.Accent 65) -Color2 (Get-Color $Cover.Secondary 30)
    Draw-Box -Graphics $Graphics -X 886 -Y 232 -Width 68 -Height 16 -Radius 8 -FillColor (Get-Color "#0b0b12" 245)
    Draw-Line -Graphics $Graphics -X 832 -Y 268 -Width 62 -Height 8 -Color (Get-Color "#ffffff" 110)
    Draw-Text -Graphics $Graphics -Text "My notes" -X 832 -Y 288 -Size 22 -Color (Get-Color "#ffffff" 235) -Bold
    Draw-Box -Graphics $Graphics -X 986 -Y 286 -Width 34 -Height 34 -Radius 17 -FillColor (Get-Color $Cover.Accent 220)
    Draw-Text -Graphics $Graphics -Text "+" -X 999 -Y 292 -Size 20 -Color (Get-Color "#ffffff" 240) -Bold

    for ($i = 0; $i -lt 3; $i++) {
        $rowY = 342 + ($i * 68)
        Draw-Box -Graphics $Graphics -X 826 -Y $rowY -Width 188 -Height 54 -Radius 14 -FillColor (Get-Color "#ffffff" 14) -BorderColor (Get-Color "#ffffff" 24)
        Draw-GradientBox -Graphics $Graphics -X 838 -Y ($rowY + 12) -Width 30 -Height 30 -Radius 10 -Color1 (Get-Color $Cover.Accent 210) -Color2 (Get-Color $Cover.Secondary 170)
        Draw-Line -Graphics $Graphics -X 880 -Y ($rowY + 16) -Width (74 + ($i * 12)) -Height 8 -Color (Get-Color "#ffffff" 170)
        Draw-Line -Graphics $Graphics -X 880 -Y ($rowY + 32) -Width 52 -Height 6 -Color (Get-Color "#ffffff" 70)
    }

    Draw-Box -Graphics $Graphics -X 826 -Y 556 -Width 188 -Height 32 -Radius 16 -FillColor (Get-Color "#ffffff" 12)
    Draw-Line -Graphics $Graphics -X 844 -Y 568 -Width 10 -Height 10 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 882 -Y 568 -Width 10 -Height 10 -Color (Get-Color $Cover.Accent 220)
    Draw-Line -Graphics $Graphics -X 920 -Y 568 -Width 10 -Height 10 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 958 -Y 568 -Width 10 -Height 10 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 996 -Y 568 -Width 10 -Height 10 -Color (Get-Color "#ffffff" 100)

    Draw-Box -Graphics $Graphics -X 612 -Y 292 -Width 96 -Height 34 -Radius 17 -FillColor (Get-Color $Cover.Accent 220)
    Draw-Text -Graphics $Graphics -Text "OFFLINE" -X 626 -Y 302 -Size 10 -Color (Get-Color "#ffffff" 240) -Bold
}

function Draw-DesignSystemContent {
    param($Graphics, $Cover)

    Draw-Line -Graphics $Graphics -X 140 -Y 270 -Width 100 -Height 10 -Color (Get-Color $Cover.Accent 230)
    Draw-Text -Graphics $Graphics -Text "Nusa UI" -X 140 -Y 292 -Size 28 -Color (Get-Color "#ffffff" 235) -Bold
    Draw-Line -Graphics $Graphics -X 140 -Y 336 -Width 220 -Height 8 -Color (Get-Color "#ffffff" 90)

    $swatches = @(
        @{ X = 140; Y = 382; Color = $Cover.Accent },
        @{ X = 264; Y = 382; Color = $Cover.Secondary },
        @{ X = 140; Y = 506; Color = "#f8fafc" },
        @{ X = 264; Y = 506; Color = "#111827" }
    )
    foreach ($swatch in $swatches) {
        Draw-GradientBox -Graphics $Graphics -X $swatch.X -Y $swatch.Y -Width 104 -Height 104 -Radius 26 -Color1 (Get-Color $swatch.Color 245) -Color2 (Get-Color $swatch.Color 180)
        Draw-Box -Graphics $Graphics -X $swatch.X -Y $swatch.Y -Width 104 -Height 104 -Radius 26 -FillColor $null -BorderColor (Get-Color "#ffffff" 35)
    }

    Draw-Text -Graphics $Graphics -Text "Aa" -X 486 -Y 258 -Size 116 -Color (Get-Color "#ffffff" 235) -Bold
    Draw-Text -Graphics $Graphics -Text "Display / 64" -X 636 -Y 278 -Size 12 -Color (Get-Color "#ffffff" 100)
    Draw-Line -Graphics $Graphics -X 486 -Y 392 -Width 590 -Height 8 -Color (Get-Color "#ffffff" 85)
    Draw-Line -Graphics $Graphics -X 486 -Y 414 -Width 470 -Height 8 -Color (Get-Color "#ffffff" 65)
    Draw-Line -Graphics $Graphics -X 486 -Y 436 -Width 540 -Height 8 -Color (Get-Color "#ffffff" 50)

    Draw-Box -Graphics $Graphics -X 486 -Y 486 -Width 150 -Height 42 -Radius 21 -FillColor (Get-Color $Cover.Accent 235)
    Draw-Text -Graphics $Graphics -Text "Primary" -X 516 -Y 498 -Size 12 -Color (Get-Color "#ffffff" 240) -Bold
    Draw-Box -Graphics $Graphics -X 650 -Y 486 -Width 150 -Height 42 -Radius 21 -FillColor (Get-Color "#ffffff" 8) -BorderColor (Get-Color "#ffffff" 100)
    Draw-Text -Graphics $Graphics -Text "Secondary" -X 671 -Y 498 -Size 12 -Color (Get-Color "#ffffff" 200) -Bold

    Draw-Box -Graphics $Graphics -X 824 -Y 486 -Width 236 -Height 42 -Radius 21 -FillColor (Get-Color "#000000" 80) -BorderColor (Get-Color "#ffffff" 45)
    Draw-Line -Graphics $Graphics -X 844 -Y 499 -Width 8 -Height 8 -Color (Get-Color "#34d399" 220)
    Draw-Text -Graphics $Graphics -Text "Channel / input" -X 862 -Y 498 -Size 11 -Color (Get-Color "#ffffff" 130)

    Draw-Box -Graphics $Graphics -X 486 -Y 548 -Width 574 -Height 70 -Radius 16 -FillColor (Get-Color "#ffffff" 10) -BorderColor (Get-Color "#ffffff" 26)
    Draw-Line -Graphics $Graphics -X 508 -Y 570 -Width 100 -Height 9 -Color (Get-Color "#ffffff" 120)
    Draw-Line -Graphics $Graphics -X 508 -Y 588 -Width 250 -Height 7 -Color (Get-Color "#ffffff" 55)
    Draw-Box -Graphics $Graphics -X 968 -Y 566 -Width 68 -Height 30 -Radius 15 -FillColor (Get-Color $Cover.Secondary 200)
    Draw-Text -Graphics $Graphics -Text "Copy" -X 986 -Y 575 -Size 10 -Color (Get-Color "#1f2937" 240) -Bold
}

$covers = @(
    @{
        Slug = "ecommerce-platform"; Number = 1; Type = "WEB APP  /  COMMERCE"; Accent = "#818cf8"; Secondary = "#22d3ee";
        Background1 = "#312e81"; Background2 = "#0b1120"; Draw = "commerce"
    },
    @{
        Slug = "task-management-app"; Number = 2; Type = "WEB APP  /  PRODUCTIVITY"; Accent = "#34d399"; Secondary = "#a7f3d0";
        Background1 = "#064e3b"; Background2 = "#0b1120"; Draw = "kanban"
    },
    @{
        Slug = "portfolio-personal"; Number = 3; Type = "WEB APP  /  PORTFOLIO"; Accent = "#c4b5fd"; Secondary = "#f0abfc";
        Background1 = "#4c1d95"; Background2 = "#0b1120"; Draw = "portfolio"
    },
    @{
        Slug = "dashboard-analitik-sekolah"; Number = 4; Type = "WEB APP  /  DATA"; Accent = "#fbbf24"; Secondary = "#fb923c";
        Background1 = "#78350f"; Background2 = "#0b1120"; Draw = "dashboard"
    },
    @{
        Slug = "catatan-kuliah"; Number = 5; Type = "MOBILE APP  /  NOTES"; Accent = "#38bdf8"; Secondary = "#818cf8";
        Background1 = "#0c4a6e"; Background2 = "#0b1120"; Draw = "mobile"
    },
    @{
        Slug = "nusa-ui-design-system"; Number = 6; Type = "UI/UX  /  DESIGN SYSTEM"; Accent = "#fb7185"; Secondary = "#f0abfc";
        Background1 = "#831843"; Background2 = "#0b1120"; Draw = "design"
    }
)

foreach ($cover in $covers) {
    $bitmap = New-Object System.Drawing.Bitmap(1200, 750)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $rect = New-Object System.Drawing.Rectangle(0, 0, 1200, 750)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        (Get-Color $cover.Background1),
        (Get-Color $cover.Background2),
        40
    )
    $graphics.FillRectangle($background, $rect)
    $background.Dispose()

    $gridPen = New-Object System.Drawing.Pen((Get-Color "#ffffff" 14), 1)
    for ($x = 0; $x -le 1200; $x += 60) {
        $graphics.DrawLine($gridPen, $x, 0, $x, 750)
    }
    for ($y = 0; $y -le 750; $y += 60) {
        $graphics.DrawLine($gridPen, 0, $y, 1200, $y)
    }
    $gridPen.Dispose()

    $circleOne = New-Object System.Drawing.SolidBrush((Get-Color $cover.Accent 25))
    $graphics.FillEllipse($circleOne, 840, -240, 620, 620)
    $circleOne.Dispose()
    $circleTwo = New-Object System.Drawing.SolidBrush((Get-Color $cover.Secondary 18))
    $graphics.FillEllipse($circleTwo, -200, 470, 520, 520)
    $circleTwo.Dispose()

    Draw-Window -Graphics $graphics -Cover $cover

    switch ($cover.Draw) {
        "commerce" { Draw-CommerceContent -Graphics $graphics -Cover $cover }
        "kanban" { Draw-KanbanContent -Graphics $graphics -Cover $cover }
        "portfolio" { Draw-PortfolioContent -Graphics $graphics -Cover $cover }
        "dashboard" { Draw-DashboardContent -Graphics $graphics -Cover $cover }
        "mobile" { Draw-MobileContent -Graphics $graphics -Cover $cover }
        "design" { Draw-DesignSystemContent -Graphics $graphics -Cover $cover }
    }

    $graphics.Dispose()
    $path = Join-Path $outputDir ($cover.Slug + ".png")
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host ("Cover dibuat: " + $path)
}
