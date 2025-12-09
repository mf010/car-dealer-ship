Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strPath = fso.GetParentFolderName(Wscript.ScriptFullName)
WshShell.CurrentDirectory = strPath
strBatch = strPath & "\background-start.bat"
WshShell.Run chr(34) & strBatch & chr(34), 0
Set WshShell = Nothing