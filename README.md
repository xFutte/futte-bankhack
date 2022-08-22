## Hacking script
NoPixel inspired hacking script by xFutte. I'll offer support in **[my Discord server](https://discord.gg/R7MMSsZJ8r)**.

### Features

- Multiple hack stages which easily can be increased or decreased
- Easy to configure amount of time per stage in the game

### Preview

![image](https://user-images.githubusercontent.com/6727484/185662984-7afd081b-64b4-467e-a25d-240988ecbaab.png)

![](https://i.imgur.com/j1Ev1lT.png)

![](https://i.imgur.com/04P31BN.png)

*Note: Above screenshots are not from the same stage*

## Setup for [qb-bankrobbery](https://github.com/qbcore-framework/qb-bankrobbery)

In the qb-bankrobbery resource, navigate to `'client/fleeca.lua'` and insert `TriggerEvent('fleeca_hack:hide')` inside the `OnHackSucces` function. This should end up looking as follows:

```lua
local function OnHackSuccess(success)
  TriggerEvent('fleeca_hack:hide')
  Config.OnHackDone(success, closestBank)
end
```
Afterwards, replace 
```lua
TriggerEvent("mhacking:show")
TriggerEvent("mhacking:start", math.random(6, 7), math.random(12, 15), OnHackDone)
``` 
with 
```lua
TriggerEvent("fleeca_hack:show")
TriggerEvent("fleeca_hack:start", math.random(6, 7), math.random(12, 15), OnHackDone)
``` 



