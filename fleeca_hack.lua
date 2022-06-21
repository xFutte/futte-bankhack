AddEventHandler('fleeca_hack:show', function()
    nuiMsg = {}
	nuiMsg.show = true
	SendNUIMessage(nuiMsg)
	SetNuiFocus(true, true)
end)

AddEventHandler('fleeca_hack:hide', function()
    nuiMsg = {}
	nuiMsg.show = false
	SendNUIMessage(nuiMsg)
	SetNuiFocus(false, false)
	showHelp = false
end)

AddEventHandler('fleeca_hack:start', function(solutionlength, duration, callback)
    hackCallback = callback
	nuiMsg = {}
	nuiMsg.s = solutionlength
	nuiMsg.d = duration
	nuiMsg.start = true
	SendNUIMessage(nuiMsg)
	showHelp = true
end)

AddEventHandler('fleeca_hack:setmessage', function(msg)
    nuiMsg = {}
	nuiMsg.displayMsg = msg
	SendNUIMessage(nuiMsg)
end)

RegisterNUICallback('callback', function(data, cb)
	hackCallback(data.success, data.remainingtime)
    cb('ok')
end)