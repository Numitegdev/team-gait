function Show-Step {

    param(

        [int]$Percent,

        [string]$Status

    )

    Write-Progress `
        -Activity "TEAM GA IT Scanner v1.0" `
        -Status $Status `
        -PercentComplete $Percent

    Write-Host ("[{0,3}%] {1}" -f $Percent,$Status) -ForegroundColor Cyan

}
Show-Step 0 "Memulai Scanner..."
#  Ambil info Hardware
Show-Step 10 "Membaca Processor..."
$Cpu = Get-CimInstance Win32_Processor
Show-Step 20 "Membaca RAM..."
$Memory = Get-CimInstance Win32_PhysicalMemory

#  Olah data Memory (RAM)

$MemoryInfo = @{
    total_gb = [math]::Round(($Memory | Measure-Object Capacity -Sum).Sum / 1GB, 0)
    modules = @()
}

foreach($ram in $Memory){
    switch($ram.SMBIOSMemoryType){
        20 {$type="DDR"}
        21 {$type="DDR2"}
        24 {$type="DDR3"}
        26 {$type="DDR4"}
        34 {$type="DDR5"}
        default {$type="Unknown"}
    }
    $MemoryInfo.modules += @{
        manufacturer = if ($ram.Manufacturer) { $ram.Manufacturer.Trim() } else { "Unknown" }
        size_gb = [math]::Round($ram.Capacity / 1GB)
        type = $type
        speed = $ram.Speed
    }
}

#  Olah data Storage
Show-Step 35 "Membaca Storage..."
$PhysicalDisks = Get-PhysicalDisk

$Volumes = Get-Volume |
Where-Object {
    $_.DriveLetter
}

$PhysicalStorage = @()

foreach($disk in $PhysicalDisks){

    $PhysicalStorage += @{

        model = $disk.FriendlyName

        media_type = $disk.MediaType

        bus_type = $disk.BusType

        size_gb = [math]::Round(
            $disk.Size / 1GB,
            0
        )

    }

}
$VolumeStorage = @()

foreach($volume in $Volumes){

    $VolumeStorage += @{

        drive = $volume.DriveLetter

        label = $volume.FileSystemLabel

        filesystem = $volume.FileSystem

        size_gb = [math]::Round(
            $volume.Size / 1GB,
            0
        )

        free_gb = [math]::Round(
            $volume.SizeRemaining / 1GB,
            0
        )

    }

}


# ============================
# GPU
# ============================
Show-Step 60 "Membaca VGA..."
$VideoControllers = Get-CimInstance Win32_VideoController

$GpuInfo = @()

foreach($gpu in $VideoControllers){

    $GpuInfo += @{

        name = $gpu.Name

        manufacturer = $gpu.AdapterCompatibility

        driver_version = $gpu.DriverVersion

        driver_date = $gpu.DriverDate

        resolution = "$($gpu.CurrentHorizontalResolution)x$($gpu.CurrentVerticalResolution)"

        video_processor = $gpu.VideoProcessor

        adapter_ram_mb = if($gpu.AdapterRAM){
            [math]::Round($gpu.AdapterRAM / 1MB)
        }else{
            0
        }

    }

}

# ============================
# MOTHERBOARD
# ============================

$Board = Get-CimInstance Win32_BaseBoard

$MotherboardInfo = @{

    manufacturer = $Board.Manufacturer

    product = $Board.Product

    serial_number = $Board.SerialNumber

    version = $Board.Version

}

# ============================
# BIOS
# ============================

$Bios = Get-CimInstance Win32_BIOS

$BiosInfo = @{

    manufacturer = $Bios.Manufacturer

    version = $Bios.SMBIOSBIOSVersion

    serial_number = $Bios.SerialNumber

    release_date = $Bios.ReleaseDate

}

# ============================
# WINDOWS
# ============================
Show-Step 50 "Membaca Windows..."


$OS = Get-CimInstance Win32_OperatingSystem

$WindowsInfo = @{

    name = $OS.Caption

    version = $OS.Version

    build = $OS.BuildNumber

    architecture = $OS.OSArchitecture

    install_date = $OS.InstallDate

    last_boot = $OS.LastBootUpTime

}

# ============================
# NETWORK
# ============================
Show-Step 70 "Membaca Network..."
$Adapters = Get-NetIPConfiguration |
Where-Object {
    $_.IPv4Address -ne $null
}

$NetworkInfo = @()

foreach($adapter in $Adapters){

    $mac = (
        Get-NetAdapter -InterfaceIndex $adapter.InterfaceIndex
    ).MacAddress

    $NetworkInfo += @{

        adapter = $adapter.InterfaceAlias

        description = $adapter.InterfaceDescription

        ipv4 = $adapter.IPv4Address.IPAddress

        gateway = if($adapter.IPv4DefaultGateway){
            $adapter.IPv4DefaultGateway.NextHop
        }else{
            ""
        }

        dns = $adapter.DNSServer.ServerAddresses

        mac_address = $mac

    }

}

# ============================
# SOFTWARE
# ============================
Show-Step 80 "Mencari Software..."
$SoftwareInfo = @()

function Add-SoftwareResult {

    param(

        [string]$Name,

        [bool]$Installed,

        [string]$Version = "",

        [string]$Path = ""

    )

    return @{

        name = $Name

        installed = $Installed

        version = $Version

        path = $Path

    }

    

}


$InstalledPrograms = @()

$InstalledPrograms += Get-ItemProperty `
HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*

$InstalledPrograms += Get-ItemProperty `
HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*

# ============================
# SOFTWARE (ACCURATE 5 DI ATAS, ACCURATE 4 DI BAWAH)
# ============================

$InstalledPrograms = @()
$InstalledPrograms += Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue
$InstalledPrograms += Get-ItemProperty HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue
$InstalledPrograms += Get-ItemProperty HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue

# --- 1. DETEKSI ACCURATE 5 (SEKARANG DI ATAS) ---
$Accurate5Reg = $InstalledPrograms | Where-Object { $_.DisplayName -like "*Accurate*5*" } | Select-Object -First 1
$Version5 = ""

if ($Accurate5Reg -and ![string]::IsNullOrEmpty($Accurate5Reg.DisplayVersion)) {
    $Version5 = $Accurate5Reg.DisplayVersion
} else {
    $Paths5 = @(
        "C:\Program Files (x86)\CPSSoft\ACCURATE5 SE\accurate.exe",
        "C:\Program Files (x86)\CPSSoft\ACCURATE5 Deluxe\accurate.exe",
        "C:\Program Files (x86)\CPSSoft\ACCURATE5 Enterprise\accurate.exe"
    )
    foreach ($P in $Paths5) { if (Test-Path $P) { $Version5 = (Get-Item $P).VersionInfo.FileVersion; break } }
}

if ($Version5) {
    $SoftwareInfo += Add-SoftwareResult -Name "Accurate 5" -Installed $true -Version $Version5
} else {
    $SoftwareInfo += Add-SoftwareResult -Name "Accurate 5" -Installed $false
}


# --- 2. DETEKSI ACCURATE 4 (SEKARANG DI BAWAH) ---
$Accurate4Reg = $InstalledPrograms | Where-Object { $_.DisplayName -like "*Accurate*4*" -or $_.DisplayName -eq "Accurate" } | Select-Object -First 1
$Version4 = ""

if ($Accurate4Reg -and ![string]::IsNullOrEmpty($Accurate4Reg.DisplayVersion)) {
    $Version4 = $Accurate4Reg.DisplayVersion
} else {
    $Paths4 = @(
        "C:\Program Files (x86)\CPSSoft\ACCURATE4 SE\accurate.exe",
        "C:\Program Files (x86)\CPSSoft\ACCURATE4 Deluxe\accurate.exe",
        "C:\Program Files (x86)\CPSSoft\ACCURATE4 Enterprise\accurate.exe"
    )
    foreach ($P in $Paths4) { if (Test-Path $P) { $Version4 = (Get-Item $P).VersionInfo.FileVersion; break } }
}

if ($Version4) {
    $SoftwareInfo += Add-SoftwareResult -Name "Accurate 4" -Installed $true -Version $Version4
} else {
    $SoftwareInfo += Add-SoftwareResult -Name "Accurate 4" -Installed $false
}

$AnyDesk =

$InstalledPrograms |

Where-Object{

    $_.DisplayName -like "*AnyDesk*"

}

if($AnyDesk){
    $SoftwareInfo += Add-SoftwareResult `
        -Name "AnyDesk" `
        -Installed $true `
        -Version $AnyDesk.DisplayVersion
}
else{
    $SoftwareInfo += Add-SoftwareResult `
        -Name "AnyDesk" `
        -Installed $false

}
$UltraViewer =

$InstalledPrograms |

Where-Object{

    $_.DisplayName -like "*UltraViewer*"

}

if($UltraViewer){
    $SoftwareInfo += Add-SoftwareResult `
        -Name "UltraViewer" `
        -Installed $true `
        -Version $UltraViewer.DisplayVersion
}
else{
    $SoftwareInfo += Add-SoftwareResult `
        -Name "UltraViewer" `
        -Installed $false
}

# ============================
# SQL SERVER
# ============================

$SqlService = Get-Service | Where-Object { $_.Name -like "MSSQL*" } | Select-Object -First 1

$SqlInfo = @{
    installed = $false
    running   = $false
    instance  = ""
    edition   = ""
    version   = ""
}

if($SqlService){
    $SqlInfo.installed = $true
    $SqlInfo.running   = ($SqlService.Status -eq "Running")

    # 1. Ambil nama Instance secara dinamis
    $SqlInstance = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL" -ErrorAction SilentlyContinue
    if($SqlInstance){
        # Mengambil properti pertama yang bukan bawaan PowerShell
        $SqlInfo.instance = ($SqlInstance.PSObject.Properties | Where-Object { $_.MemberType -eq 'NoteProperty' } | Select-Object -First 1).Name
    }

    # 2. Cari folder Setup secara dinamis menggunakan nama Instance yang didapat
    if ($SqlInfo.instance) {
        # Mencari folder registry yang berakhiran sesuai nama instance (misal: MSSQL16.SQLEXPRESS atau MSSQL15.MSSQLSERVER)
        $SqlSetupPath = Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*" -ErrorAction SilentlyContinue | 
                        Where-Object { $_.PSChildName -like "*.$($SqlInfo.instance)" -or $_.PSChildName -eq $SqlInfo.instance } | 
                        Select-Object -First 1

        if ($SqlSetupPath) {
            $SqlSetup = Get-ItemProperty "$($SqlSetupPath.PSPath)\Setup" -ErrorAction SilentlyContinue
            if($SqlSetup){
                $SqlInfo.edition = $SqlSetup.Edition
                $SqlInfo.version = $SqlSetup.Version
            }
        }
    }
    
    # 3. BACKUP PLAN: Jika registry setup di atas gagal/kosong, ambil langsung dari file (.exe) layanannya
    if ([string]::IsNullOrEmpty($SqlInfo.version)) {
        $SqlProcess = Get-CimInstance Win32_Service | Where-Object {$_.Name -eq $SqlService.Name}
        if ($SqlProcess -and $SqlProcess.PathName -match '"([^"]+)"') {
            $ExePath = $Matches[1]
            if (Test-Path $ExePath) {
                $SqlInfo.version = (Get-Item $ExePath).VersionInfo.FileVersion
            }
        }
    }
}

$swPaths = @()

if (Test-Path "C:\SW") {
    $swPaths += "C:\SW"
}

if (Test-Path "D:\SW") {
    $swPaths += "D:\SW"
}

$clientAll = @()
$client = @()
$monitor = @()

foreach ($swRoot in $swPaths) {

    foreach ($dir in Get-ChildItem $swRoot -Directory) {

        switch -Wildcard ($dir.Name) {

            "Otomax*" {

                $clientAll += $dir.Name

            }

            "Client*" {

                $client += $dir.Name

            }

            "OTO_Monitor*" {

                $monitor += $dir.Name

            }

            "Client All Induk" {

                Get-ChildItem $dir.FullName -Directory | ForEach-Object {

                    if ($_.Name -like "Otomax*") {
                        $clientAll += $_.Name
                    }

                }

            }

            "Client Otomax" {

                Get-ChildItem $dir.FullName -Directory | ForEach-Object {

                    if ($_.Name -like "Client*") {
                        $client += $_.Name
                    }

                }

            }

            "New Oto Monitoring" {

                Get-ChildItem $dir.FullName -Directory | ForEach-Object {

                    if ($_.Name -like "OTO_Monitor*") {
                        $monitor += $_.Name
                    }

                }

            }

        }

    }

}
$SoftwareInfo += @{

    name = "SQL Server"

    installed = $SqlInfo.installed

    version = $SqlInfo.version

    path = ""

}

$SoftwareInfo += @{

    name = "Client All Induk"

    installed = ($clientAll.Count -gt 0)

    version = ""

    path = ($swPaths -join ", ")

    items = $clientAll | Sort-Object -Unique

}
$SoftwareInfo += @{

    name = "Client Otomax"

    installed = ($client.Count -gt 0)

    version = ""

    path = ($swPaths -join ", ")

    items = $client | Sort-Object -Unique

}
$SoftwareInfo += @{

    name = "OTO Monitor"

    installed = ($monitor.Count -gt 0)

    version = ""

    path = ($swPaths -join ", ")

    items = $monitor | Sort-Object -Unique

}


###############################
#  Satukan Output JSON
##############################
Show-Step 92 "Menyusun Hasil Scanner..."
$Result = @{

    scanner_version = "1.0.0"

    scan_time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")

    computer = @{

        hostname = $env:COMPUTERNAME

        username = $env:USERNAME

        domain = $env:USERDOMAIN

    }

    cpu = @{

        vendor = $Cpu.Manufacturer

        model = $Cpu.Name.Trim()

        cores = $Cpu.NumberOfCores

        threads = $Cpu.NumberOfLogicalProcessors

        max_clock = $Cpu.MaxClockSpeed

    }

    memory = $MemoryInfo

    storage = @{

        physical = $PhysicalStorage

        volumes = $VolumeStorage

    }

    gpu = $GpuInfo

    motherboard = $MotherboardInfo

    bios = $BiosInfo

    windows = $WindowsInfo

    network = $NetworkInfo

    software = $SoftwareInfo



}

# 5. Path Output (Menggunakan USERPROFILE agar pasti ke desktop user aktif)
Show-Step 97 "Menyimpan scanner_result.json..."
$Path = "$env:USERPROFILE\Desktop\$($env:COMPUTERNAME).json"

# Export ke JSON

Write-Progress `
    -Activity "TEAM GA IT Scanner v1.0" `
    -Completed

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host " Scanner selesai." -ForegroundColor Green
Write-Host " JSON berhasil dibuat." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

$Result | ConvertTo-Json -Depth 10 | Out-File $Path -Encoding UTF8

Write-Host ""
Write-Host "Scanner selesai."
Write-Host "File disimpan di: $Path"
Pause