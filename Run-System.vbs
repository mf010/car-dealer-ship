Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strPath = fso.GetParentFolderName(Wscript.ScriptFullName)
WshShell.CurrentDirectory = strPath
WshShell.Run chr(34) & "background-start.bat" & chr(34), 0
Set WshShell = Nothing