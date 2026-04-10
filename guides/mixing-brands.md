---
layout: guide.njk
title: "Can I Mix and Match Parts from Different Brands?"
description: "Short answer: yes, brand loyalty is optional. But read the fine print."
tags: ["compatibility", "beginner"]
related_categories: ["wheelbase", "wheel_rim", "pedals", "shifter"]
---

## The short answer

Yes. Many components in a sim rig connects to your PC over USB independently. Your pedals don't need to care what wheelbase you're using, and your shifter doesn't need to match your pedals. But some vendors make that harder than others, and full freedom may cost more money than an integrated bundle.

## Research your wheel needs first

The most complex compatibility challenge in sim racing lives at the junction between the wheelbase and the steering wheel rim. Manufacturers engineer their hardware with varying degrees of proprietary lock-in. Compatibility is divided into two categories: mechanical compatibility (whether the wheel can be attached to the base) and electronic compatibility (whether the buttons, shifters, and force feedback will function).

- **Logitech** - Historically operating a completely closed ecosystem known for entry-level gear-driven bases, Logitech shifted its paradigm with the release of the direct drive G Pro Racing Wheel. While initially locked down, the introduction of the Logitech G RS QR Adapter opened the ecosystem mechanically. This adapter features standard 70mm and 50.8mm Pitch Circle Diameter (PCD) mounting patterns, allowing the fitment of premium third-party rims from manufacturers like Cube Controls, GSI, and Moza. However, electronic compatibility remains segregated; the wheelbase will not process third-party telemetry, meaning aftermarket wheels must utilize their own standalone USB cables to transmit button and paddle inputs to the PC.
- **Thrustmaster** - Thrustmaster operates a rigidly closed electronic ecosystem, relying heavily on a massive catalog of legacy first-party wheel rims. The introduction of the T818 direct drive wheelbase maintained this proprietary approach, utilizing a proprietary quick release. While some aftermarket mechanical adapters exist to mount standard rims, the lack of electronic integration renders third-party wheels lifeless, making Thrustmaster a challenging environment for high-end mix-and-match enthusiasts.
- **Fanatec** - Fanatec maintains the largest first-party ecosystem in sim racing but employs aggressive electronic lock-in. A Fanatec wheelbase actively searches for an electronic handshake from a recognized Fanatec steering wheel via the pins in the Quick Release (QR1 or QR2). If a third-party wheel is simply bolted onto a Fanatec QR without the proper internal electronics, the wheelbase will proactively disable all force feedback as a proprietary enforcement measure. To bypass this restriction natively, drivers must purchase a Fanatec Podium Hub or Universal Hub, which contains the necessary authorization chip while providing standard 6x70mm or 3x50mm bolt patterns for aftermarket rims.
- **Moza** - Moza utilizes an aluminum quick release based on the D1 spec NRG-style system, which natively supports 70mm PCD aftermarket adapters. Mechanically, attaching a third-party wheel to a Moza R9 or R12 base is straightforward. Electronically, however, Moza wheelbases do not process data from non-Moza wheels. Therefore, any third-party wheel mounted to a Moza base must feature an independent USB or Bluetooth connection to the PC to handle shifting and button inputs.
- **Simucube** - Simucube has recently changed their wheel mounting strategy with the release of the Simucube 3 wheelbases. In the Simucube 2 ecosystem, the QR is strictly mechanical, and wheel function is provided either by wireless Simucube Link protocol, or independently through USB. In the move to the Simucube 3 ecosystem, power and data are transmitted through Simucube Lightbridge, a proprietary connection integrated into high end wheels from Simucube itself, BavarianSimTec, and GSI. USB direct connection of the wheel is still possible.
- **Simagic** - Simagic employs a QR50 and QR70 ball-bearing quick-release system. Similar to Moza, Simagic wheelbases demand that third-party steering wheels handle their own data transmission to the PC. Simagic’s most notable contribution to cross-compatibility is its willingness to build wheels that work outside its own ecosystem, specifically via the Maglink system, which allows its popular rims to be used on rival bases.
- **VRS** - VRS utilizes a hub adapter that provides six threaded holes for the 70mm PCD standard. This allows Open Sim Wheel (OSW) compatible steering wheels, third-party quick releases, and USB conversion kits to be directly mounted without forcing the user into a mandatory proprietary quick release system.

## Adapters, Emulators, and Conversion Kits

The demand for cross-brand compatibility has spawned a highly specialized aftermarket industry dedicated to bypassing proprietary restrictions, allowing drivers to mix hardware that was never intended to be paired. Selecting and using these is beyond the scope of this guide, and the recommendation tables do not account for their existence.

## Pedal, Shifter, and Handbrake Independence

High-end pedals, often considered an important upgrade for improving lap times, are almost exclusively designed as standalone USB devices. Sets such as Heusinkveld Sprints, the Simagic P1000s, or the ultra-premium Simucube ActivePedal; these units connect directly to the PC and are calibrated through their own software, rendering the brand of the wheelbase completely irrelevant. When sold as a set of 2 or 3 pedals, they may have a control box that itself connects via USB, while the individual pedals use an RJ-45 connection to the control box.

For many peripherals that are intended to connect to a proprietary wheelbase, the manufacturer will sell a stand-alone USB converter for that component.