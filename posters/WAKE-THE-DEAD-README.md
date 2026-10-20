# WAKE THE DEAD: main poster and SIP AND KILL booth

| File | What it is |
|---|---|
| `wake-the-dead-main-3240x4050.jpg` | Main poster, print master. 4:5 portrait, 10.8 × 13.5 in at 300 dpi |
| `wake-the-dead-main-print.pdf` | The same poster as a one-page PDF |
| `wake-the-dead-main-1080x1350.png` | The same poster at Instagram portrait size |
| `booth-sip-and-kill-3600x2400.jpg` | Booth render, based on the original booth mockup |
| `source/wake-the-dead.html`, `source/booth-render.html` | Editable sources |
| `source/render.cjs` | Renders a source to PNG |

To re-render:
`NODE_PATH=$(npm root -g) node posters/source/render.cjs posters/source/wake-the-dead.html <outDir> 3`
The last argument is the scale: 1 gives 1080 × 1350, 3 gives the print size.

## Art direction
The poster uses three inks on aged cream paper: blood red `#B3141C`, black `#130E0E` and cream `#E6D9BD`. There is no blue and none of Terownie's brand colours.
- **Death by Disco:** a newspaper grid with a heavy frame, condensed type justified to fill each box, a big title with a picture box beside the second line (the event's own pumpkin host), a photo panel beside the facts box, one huge number (₱400), ★ bullets and DbD-style sparkles.
- **Retro Halloween grid:** the crowd band at the bottom is printed in one colour, the scream panel is red halftone on black like the red CRT tile, and the whole sheet has photocopy grit and fold creases.
- **Disco Devil:** halftone photo treatment, with the event rules printed on torn strips laid over the image band.

## Event facts (from the PUMP.BOYZ × EVPHORIA flyers only)
PUMP.BOYZ × EVPHORIA · HOUSE PARTY: HALLOWEEN SPECIAL · FRI 10.30, doors open 3 PM · TWIN-PEAKS MOUNTAIN, BRGY. DAPDAP, TAYABAS CITY · ₱400 early price · What's inside: free booze during happy hour (3–7 PM), Studio Co-Lab photobooth, food & merchant pop-ups, tattoo, piercing & face paint, giveaways & surprise prizes · 8 DJs on deck in one night: I CIAN, II ECKA, III SEF, IV YONEN, V SEAN, VI DHEEJAY, VII ELLE, VIII NJ · Costume is a must · Strictly no minors allowed · Feel free to get wet.
Not used: the "Scan for directions" QR code, because the real code can't be reproduced. Add it yourself if you want it.

## Logo
The poster has **no logo**. The cream tag at the bottom right is left empty for you to place the Terownie logo. In 1080 × 1350 units it sits at x 768, y 1078 (236 × 182). Keep the logo above the black caption bar, which reads "HALLOWEEN POP-UP · SIP AND KILL". At the print size, multiply those numbers by 3.

## Booth: what was kept and what changed
**Kept from your mockup:** the white 3 × 3 m pop-up canopy with black legs and scissor truss, the hung back banner with two spray-painted spiral eyes and red splatter, the black patterned throw with fringe over a folding table, the low two-tier rack in front-left with three glowing cones and an LED strip, the plush bear, the plush panda, the red mushroom lamp, the menu board, the red straw cup, three red camping lanterns, two potted olive trees, and the night lawn.
**Changed:**
- The banner, rack and throw moved from navy and blue to black, red and cream.
- The throw now has a skull, crossbones and bat line-art print.
- New signage: a printed front valance reading "SIP AND KILL", a red torn-strip banner on the table front, and a menu card done in the poster's style.
- New props: a riser with the four menu drinks (Strawberry Matcha, Taro Cloud, Dirty Matcha, Biscoff Sea Salt; no prices), two small pumpkins, cobwebs in the two front corners, and two red floor uplights washing the banner.

## Photo credits
The scream panel and the crowd band use CC BY 2.0 photos by Grmisiti. When you post the poster, add this line to the caption: "Photos: Grmisiti (CC BY 2.0)". See `public/photos/CREDITS.md`.

## Version B: horror-movie one-sheet
Files: `wake-the-dead-b-3240x4050.jpg`, `wake-the-dead-b-print.pdf`, `wake-the-dead-b-1080x1350.png`. Source: `source/wake-the-dead-b.html`.
- **Layout:** a full-bleed black sheet instead of the newspaper grid. A big red halftone scream with CRT scanlines fills the top and fades into black.
- **Type:** WAKE THE runs across the top, and a full-width DEAD sits over the mouth, in cream with a red offset shadow.
- **Facts:** the date and venue are on torn strips, the ₱400 early price is a rubber-stamp disc, and the DJs, inside list and house rules are in a movie-poster credits block at the bottom.
- **Logo:** the empty black area at the bottom right (x 830, y 1120, 202 × 150 in 1080 × 1350 units) is for your logo, above the "HALLOWEEN POP-UP · SIP AND KILL" caption. There is still no logo on the poster.
- **Photo credit:** the same as version A. Add "Photos: Grmisiti (CC BY 2.0)" to the caption.

## Terownie page poster (booth promo)
Files: `terownie-popup-wake-the-dead-3240x4050.jpg`, `-print.pdf`, `-1080x1350.png`. Source: `source/wake-the-dead-popup.html`.
This poster is for the Terownie page and promotes the SIP AND KILL booth at the PUMP.BOYZ × EVPHORIA house party. It is styled after the event's own flyers: aged comic paper, a black header bar, a drippy horror title, a yellow "DON'T MISS OUT" burst, a panel grid in the flyers' colours, and halftone with grain.
The panels are:
- the booth render printed as a comic frame
- the Terownie logo (the supplied file, recoloured to cream) with SIP AND KILL
- the four real menu drinks
- the date (Friday the 30th of October, doors open at 3 PM)
- the venue

## "Terownie will be there" announcement (no booth, no drinks)
Files: `terownie-will-be-there-3240x4050.jpg`, `-print.pdf`, `-1080x1350.png`. Source: `source/wake-the-dead-announce.html`.
- **Style:** the same as the event flyers.
- **Hero panel:** the event's own shocked costume-crowd art, with a speech bubble saying "IS THAT... TEROWNIE?!".
- **Announcement:** the Terownie logo with "WILL BE THERE! · SIP AND KILL · HALLOWEEN POP-UP".
- **Details:** the date and venue panels.

## Comic-cover pop-up announcement
Files: `terownie-popup-comic-cover-3240x4050.jpg`, `-print.pdf`, `-1080x1350.png`. Source: `source/wake-the-dead-cover.html`.
- **Style:** a vintage horror comic-book cover with a "No. 30 / OCT" issue box, a sunset sky, a full moon with rays, and bats.
- **Characters:** the event's pumpkin host asks "GUESS WHO'S POPPING UP?" A tilted guest card styled like the flyer's DJ cards carries the Terownie logo, "SIP AND KILL" and "HALLOWEEN POP-UP", with a "POP-UP ALERT!" burst and "WILL BE THERE!" below. The costume crowd peeks up from the bottom, asking "IS THAT... TEROWNIE?!".
- **Footer:** "Friday the 30th of October · Doors open at 3PM" and the Twin-Peaks Mountain venue box.

## Retro TV pop-up poster
Files: `terownie-popup-retro-tv-3240x4050.jpg`, `-print.pdf`, `-1080x1350.png`. Source: `source/wake-the-dead-tv.html`.
Each element is borrowed from one of the reference posters:
- **Fright Night:** a tall, condensed serif title with spaced-out lettering underneath, over a halftone crowd glowing red.
- **Halloween Retro Party:** a vintage CRT TV showing the event's pumpkin host in full colour with scanlines, ringed by a red dot halo, and a facts bar split by dividers. The background crowd has a faint colour wash.
- **Disco Devil:** the "A HALLOWEEN POP-UP BY" lockup with the Terownie logo and a torn red "SIP AND KILL" strip.
- **Red Halloween Party flyer:** distressed sparkles, a "30 OCT" corner stamp, ★★★, and a hand-drawn circle around the venue.

### Halo colour versions
`retro-tv-halo-colors/` has the same retro TV poster in seven halo colours: orange, gold, cream, purple, acid green, electric blue and hot pink. Only the halftone dot halo around the TV changes. `_compare.jpg` shows them side by side with the original red. To render another colour:
`NODE_PATH=$(npm root -g) node posters/source/render.cjs posters/source/wake-the-dead-tv.html <outDir> 3 halo=F5921E`

### Retro TV polish pass (red halo, layout unchanged)
- **TV:** a warm glow from the screen, highlights along the cabinet edges, antenna tips, and a shadow under the TV.
- **Screen:** a VHS overlay reading "▶ PLAY", "SP" and "OCT. 30".
- **Title:** a faint red offset behind "WAKE THE DEAD".
- **Logo and strip:** a soft red glow behind the logo and blood drips under the "SIP AND KILL" strip.
- **Whole poster:** a stronger vignette and film burn in the top-left and bottom-right corners.

### Retro TV: details from the second reference set
- **Room & Rave:** bats flying out of the TV, plus creased-paper fold lines.
- **Hallowia:** a VHS tracking-glitch band at the bottom of the screen.
- **Reloaded:** a faint plastic-wrap sheen.
- **Red Halloween Party flyer:** corner stamps with the event's real house rules, "COSTUME IS A MUST" and "STRICTLY NO MINORS".
- **"SIP AND KILL":** now set in Creepster, a drippy horror font, in cream with a dark blood shadow.
- **Background crowd:** zoomed out so the characters are recognisable and peek around the TV, with a crisp red-and-black duotone and halftone dots instead of the blur, fading softly at the top and bottom.
- **Masked slasher:** a giant hooded, Ghostface-style figure looms from above, centred behind the TV and bigger than the crowd. Its eyes stare out above the TV, its screaming mouth shows below it, and it has a red rim light and the halftone halo in front.

## Retro TV poster: vintage print edition
Files: `terownie-popup-retro-print-3240x4050.jpg`, `-print.pdf`, `-1080x1350.png`. Source: `source/wake-the-dead-tv-retro.html`.
- **Base:** the retro TV poster without Ghostface, with an identical layout.
- **Retro finish:** a faded, warm vintage colour grade with lifted blacks and yellowed whites, faint ink misregistration and paper grain. It's full-bleed, with no border.
