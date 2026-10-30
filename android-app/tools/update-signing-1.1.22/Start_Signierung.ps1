$ErrorActionPreference = 'Stop'
$command = Get-Command javaw.exe -ErrorAction SilentlyContinue
if ($command) { $java = $command.Source }
else {
    $roots = @((Join-Path $env:USERPROFILE '.bubblewrap'), (Join-Path $env:USERPROFILE 'Documents\Codex'))
    $java = Get-ChildItem -LiteralPath $roots -Filter javaw.exe -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $java) {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show('Java wurde nicht gefunden. Bitte UpdateSignieren.jar mit der bisherigen Java-Installation starten.')
    exit 1
}
$jar = Join-Path $PSScriptRoot 'UpdateSignieren.jar'
Start-Process -FilePath $java -ArgumentList @('-jar', ('"' + $jar + '"'))
