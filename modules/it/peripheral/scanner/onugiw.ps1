#  Ambil info Hardware
$Cpu = Get-CimInstance Win32_Processor
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

# $OtomaxInfo = @{

#     installed = $false

#     running = $false

#     version = ""

# }

# if($OtomaxService){

#     $OtomaxInfo.installed = $true

#     $OtomaxInfo.running =
#         ($OtomaxService.Status -eq "Running")

# }

$SoftwareInfo += @{

    name = "SQL Server"

    installed = $SqlInfo.installed

    version = $SqlInfo.version

    path = ""

}
# $SoftwareInfo += @{

#     name = "Otomax Server"

#     installed = $OtomaxInfo.installed

#     version = $OtomaxInfo.version

#     path = ""

# }

# $FolderList = @(
#     "Client All Induk",
#     "Client Otomax",
#     "New Oto Monitoring"
# )

# function FindFolder {

#     param(
#         [string]$FolderName
#     )

#     $roots = @(
#         "C:\",
#         "D:\",
#         "E:\",
#         "F:\"
#     )

#     foreach($root in $roots){

#         $folder = Get-ChildItem `
#             -Path $root `
#             -Directory `
#             -Filter $FolderName `
#             -Recurse `
#             -ErrorAction SilentlyContinue |
#             Select-Object -First 1

#         if($folder){

#             return @{
#                 installed = $true
#                 path = $folder.FullName
#             }

#         }

#     }

#     return @{
#         installed = $false
#         path = ""
#     }

# }

# foreach($folder in $FolderList){

#     $result = FindFolder $folder

#     $SoftwareInfo += @{

#         name = $folder

#         installed = $result.installed

#         version = ""

#         path = $result.path

#     }

# }
#  Satukan Output JSON
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
$Path = "$env:USERPROFILE\Desktop\$($env:COMPUTERNAME).json"

# Export ke JSON
$Result | ConvertTo-Json -Depth 10 | Out-File $Path -Encoding UTF8

Write-Host ""
Write-Host "Scanner selesai."
Write-Host "File disimpan di: $Path"
Pause