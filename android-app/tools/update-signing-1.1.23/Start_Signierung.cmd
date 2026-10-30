@echo off
setlocal
set "LESESPIELE_SIGN_JAR=%~dp0UpdateSignieren.jar"
powershell.exe -NoProfile -Command "$ErrorActionPreference='Stop'; $cmd=Get-Command java.exe -ErrorAction SilentlyContinue; if($cmd){$exe=$cmd.Source}else{$roots=@(($env:USERPROFILE+'\.bubblewrap'),($env:USERPROFILE+'\Documents\Codex'),($env:ProgramFiles+'\Eclipse Adoptium'),($env:ProgramFiles+'\Java')); $exe=Get-ChildItem -LiteralPath $roots -Filter java.exe -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName}; if(-not $exe){Write-Host 'Java nicht gefunden. Bitte die bisherige Java-Installation verwenden.'; exit 1}; $jar=$env:LESESPIELE_SIGN_JAR; if(-not (Test-Path -LiteralPath $jar)){Write-Host 'UpdateSignieren.jar bitte im gleichen Ordner speichern.'; exit 1}; $p=Start-Process -FilePath $exe -ArgumentList ('-jar '+[char]34+$jar+[char]34) -PassThru -Wait; exit $p.ExitCode"
if errorlevel 1 pause
endlocal
