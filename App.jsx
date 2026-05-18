import { useState, useEffect, useCallback } from "react";

// ─── MEALS ───────────────────────────────────────────────────────────────────

const HITS = [
  { id:1,  name:"miso garlic shrimp linguine", components:["frozen shrimp","linguine","white miso + garlic butter"], cuisine:"italian", time:20,
    recipe:"Cook linguine al dente. In a wide pan, melt 3 tbsp butter with 4 smashed garlic cloves until fragrant. Whisk in 1 tbsp white miso. Add thawed shrimp, cook 2 min per side. Toss in drained pasta with a splash of pasta water. Finish with parm and a squeeze of lemon. The miso is the move." },
  { id:2,  name:"orecchiette with sausage & kale", components:["italian sausage","orecchiette","kale"], cuisine:"italian", time:30,
    recipe:"Cook orecchiette. Brown sausage (removed from casing), breaking it up well. Add torn kale and a ladle of pasta water, cook until wilted. Toss with drained pasta. Finish with parm and a drizzle of good olive oil." },
  { id:3,  name:"chicken meatballs arrabiata", components:["chicken meatballs","rao's arrabiata","fresh mozz"], cuisine:"italian", time:20,
    recipe:"Brown meatballs in olive oil until golden, about 8 min. Pour over Rao's arrabiata, cover and simmer 10 min. Tear fresh mozzarella over the top off heat. Serve with good bread or over pasta." },
  { id:4,  name:"steamed sea bass", components:["sea bass","ginger + scallion","jasmine rice"], cuisine:"cantonese", time:25,
    recipe:"Start jasmine rice. Steam sea bass with sliced ginger 8-10 min until just opaque. Heat sesame oil until smoking, pour directly over fish with soy sauce — it crackles and perfumes everything. Serve over rice." },
  { id:5,  name:"tofu with minced pork & pea shoots", components:["silken tofu","minced pork","pea shoots"], cuisine:"cantonese", time:20,
    recipe:"Brown minced pork in a hot wok. Add 2 tbsp soy sauce, 1 tbsp oyster sauce, pinch of sugar. Gently fold in cubed silken tofu. Add pea shoots last 1 min. Finish with sesame oil. Serve over rice." },
  { id:6,  name:"salmon with asparagus", components:["salmon","asparagus","lemon + fleur de sel"], cuisine:"simple", time:20,
    recipe:"Season salmon. Sear skin-side down 4 min. Flip, add asparagus to pan, transfer to 400°F oven 6-8 min. Rest 2 min. Finish asparagus with lemon and fleur de sel." },
  { id:7,  name:"japanese curry with kabocha", components:["chicken thighs","potato + kabocha","japanese curry roux"], cuisine:"japanese", time:35,
    recipe:"Sauté chicken until golden. Add potato and kabocha chunks and water to cover. Simmer 15 min. Reduce heat, add curry roux blocks, stir until dissolved. Simmer 5 more min until thick. Kabocha sweetens the whole dish. Serve over jasmine rice." },
  { id:8,  name:"vodka sauce chicken basil", components:["chicken thighs","vodka sauce","fresh basil"], cuisine:"italian", time:25,
    recipe:"Sear chicken thighs skin-side down until golden, 6 min. Flip, add vodka sauce, cover and simmer 15 min. Tear fresh basil over the top. Serve with pasta or crusty bread." },
  { id:17, name:"miso sake haddock", components:["haddock","white miso + mirin + honey","bok choy"], cuisine:"japanese", time:25,
    recipe:"Mix 2 tbsp white miso, 2 tbsp mirin, 1 tbsp sake, 1 tsp honey. Pat haddock completely dry — critical step. Coat and marinate 15-20 min. Broil on high close to element 8-10 min until lacquered and caramelized. Watch carefully last 2 min. Take off broiler 60 seconds early, place cold butter slice on top to melt. The honey-miso finish is the move." },
  { id:18, name:"teriyaki wings with honey finish", components:["chicken wing flats","teriyaki + honey glaze","sesame + scallion"], cuisine:"japanese", time:35,
    recipe:"Pat flats completely dry. Arrange on a wire rack over a foil-lined sheet pan — rack is essential. Roast at 425°F 25-30 min turning once. Brush generously with teriyaki mixed with a touch of honey. Broil on high 3-4 min until lacquered. Watch closely. Finish with sesame seeds and scallion." },
];

const NEW_MEALS = [
  { id:9,  name:"miso glazed salmon", components:["salmon","white miso glaze","baby bok choy"], cuisine:"japanese", time:25, isNew:true,
    recipe:"Mix 2 tbsp white miso, 1 tbsp mirin, 1 tbsp sake, 1 tsp sugar. Coat salmon and marinate 10 min. Broil 8-10 min until caramelized. Sear bok choy cut-side down in sesame oil 3 min per side. Serve over rice." },
  { id:10, name:"oyakodon", components:["chicken thighs","egg","dashi rice"], cuisine:"japanese", time:20, isNew:true,
    recipe:"Make dashi (1 cup water + 1 dashi packet). Add 2 tbsp soy sauce, 2 tbsp mirin, 1 tbsp sake. Simmer sliced chicken 5 min. Pour beaten eggs over, cover 1 min until just set — leave slightly runny. Slide over steamed rice. Top with scallion." },
  { id:11, name:"mussels in white wine", components:["PEI mussels","white wine + butter","crusty bread"], cuisine:"french", time:20, isNew:true,
    recipe:"Sweat shallot and garlic in butter 2 min. Add 1 cup white wine, bring to boil. Add scrubbed mussels, cover 4-5 min until open. Finish with a knob of butter, parsley, black pepper. Serve with crusty bread for the broth." },
  { id:12, name:"ginger scallion fish", components:["sea bass","fresh ginger","sizzling scallion oil"], cuisine:"cantonese", time:25, isNew:true,
    recipe:"Steam sea bass 8-10 min. Julienne scallions and ginger, pile on top of fish. Heat 3 tbsp neutral oil + 1 tbsp sesame oil until smoking. Pour sizzling over fish and scallions — it crackles. Finish with soy sauce." },
  { id:13, name:"pan sauce chicken", components:["chicken thighs","shallot + white wine pan sauce","haricots verts"], cuisine:"french", time:35, isNew:true,
    recipe:"Sear chicken thighs skin-side down in butter and oil 8 min. Flip, cook 12 more min. Rest. In same pan soften shallots, add white wine, scrape the fond. Add chicken stock, reduce by half. Finish with cold butter. Blanch haricots verts 3 min. Spoon sauce over everything." },
  { id:14, name:"cold soba", components:["soba noodles","tsuyu sauce","scallion + nori + wasabi"], cuisine:"japanese", time:15, isNew:true,
    recipe:"Cook soba per package. Drain and rinse under cold water until cold. Dilute tsuyu concentrate with cold water. Serve noodles in bowls with dipping sauce alongside. Top with scallion, nori strips, dab of wasabi. Dip and eat." },
  { id:15, name:"braised pork belly rice", components:["pork belly","soy mirin glaze","steamed rice"], cuisine:"japanese", time:40, isNew:true,
    recipe:"Score pork belly skin and sear all sides until golden. Remove. In same pan: ¼ cup soy, ¼ cup mirin, 2 tbsp sake, 1 tbsp sugar, 1 cup water. Return pork, cover and braise on low 30 min. Slice and serve over rice with braising liquid. Top with scallion." },
  { id:16, name:"shrimp provençal", components:["shrimp","cherry tomatoes + herbs de provence","white wine"], cuisine:"french", time:20, isNew:true,
    recipe:"Sauté 3 garlic cloves in olive oil. Add cherry tomatoes, generous pinch of herbs de provence, salt and pepper. Cook until tomatoes burst, 5 min. Add shrimp and white wine, cook 2-3 min per side. Finish with parsley and lemon. Serve with crusty bread or over orzo." },
  { id:19, name:"black cod miso", components:["black cod","white miso + mirin glaze","steamed bok choy"], cuisine:"japanese", time:30, isNew:true,
    recipe:"Mix 3 tbsp white miso, 2 tbsp mirin, 1 tbsp sake, 1 tbsp sugar. Marinate black cod 2-24 hours — longer is better. Wipe off excess marinade before cooking. Broil on high 10-12 min until deeply caramelized. The fish is rich and buttery, the glaze is everything. Serve with steamed bok choy over rice." },
  { id:20, name:"seared scallops", components:["hokkaido scallops","brown butter + lemon","haricots verts"], cuisine:"french", time:15, isNew:true,
    recipe:"Pat scallops completely dry — essential. Season with salt. Sear in very hot neutral oil without moving 2 min until deep golden crust forms. Flip, cook 1 min. Remove. In same pan make brown butter — swirl until nutty and amber. Add lemon juice off heat. Pour over scallops. Serve immediately over blanched haricots verts." },
  { id:21, name:"monkfish with caper butter", components:["monkfish","brown butter + capers + lemon","asparagus"], cuisine:"french", time:25, isNew:true,
    recipe:"Remove the grey membrane from monkfish — peel with a sharp knife or it will tighten when cooked. Season and sear in butter and oil 4 min per side until golden. Rest. In same pan make brown butter with capers and lemon juice. Pour over fish. Serve alongside roasted asparagus." },
  { id:22, name:"butter chicken", components:["chicken thighs","butter chicken sauce","jasmine rice"], cuisine:"simple", time:25, isNew:true,
    recipe:"Cut chicken thighs into chunks. Sear briefly until golden. Add a good butter chicken simmer sauce from Weee, cover and simmer 15 min until chicken is cooked through and sauce is thick. Serve over jasmine rice. The kids will love this one." },
];

// ─── INSPIRATION RECIPES — "WHOA FACTOR" ─────────────────────────────────────

const INSPIRATION = [
  {
    id:"i1", tag:"nyt adaptation", cuisine:"italian", time:20,
    name:"cacio e pepe",
    why:"three ingredients. the most technically satisfying pasta you can make. when you nail the emulsion it tastes like a roman restaurant.",
    source:"Adapted from NYT Cooking — Samin Nosrat",
    components:["spaghetti","parmigiano + pecorino","black pepper"],
    recipe:"Toast 2 tsp coarsely cracked black pepper in a dry pan until fragrant, 1 min. Cook spaghetti in well-salted water. Reserve 1 cup pasta water before draining. Add ½ cup pasta water to the pepper pan over low heat. Add drained pasta, toss. Off heat, add a generous handful each of finely grated parm and pecorino in batches, tossing constantly and adding pasta water gradually until the sauce is creamy and coats everything. The key is low heat and patience with the emulsion. No cream. Ever.",
    grad:"linear-gradient(135deg,#c9a87c,#b89068)"
  },
  {
    id:"i2", tag:"nyt adaptation", cuisine:"cantonese", time:15,
    name:"soy butter corn",
    why:"a kenji alt-lopez nyt recipe that takes 10 minutes and tastes like the best thing you've ever put next to rice.",
    source:"Adapted from NYT Cooking — J. Kenji López-Alt",
    components:["corn kernels","soy sauce + butter","scallion"],
    recipe:"Cut corn off the cob or use frozen. Melt 2 tbsp butter in a hot pan. Add corn, let it sit without stirring 2 min until charred. Add 1 tbsp soy sauce and toss — it will sizzle aggressively. Scatter scallion over the top. That's it. Serve alongside any protein or toss through rice. The soy butter char is the whole thing.",
    grad:"linear-gradient(135deg,#c8c8a0,#b8b890)"
  },
  {
    id:"i3", tag:"nyt adaptation", cuisine:"french", time:35,
    name:"roasted chicken thighs with lemon and olives",
    why:"melissa clark's formula. one pan, under 40 min, tastes like you spent all day on it.",
    source:"Adapted from NYT Cooking — Melissa Clark",
    components:["chicken thighs","castelvetrano olives + lemon","fresh thyme"],
    recipe:"Season chicken thighs well. Sear skin-side down in an oven-safe pan until deeply golden, 8 min. Flip. Scatter castelvetrano olives, lemon slices, and fresh thyme around the chicken. Transfer to 425°F oven 20 min until cooked through. The olives and lemon become a sauce in the pan juices. Spoon everything over the chicken to serve. Castelvetrano olives are the key — buttery and mild, not briny.",
    grad:"linear-gradient(135deg,#9b8ec4,#8070b0)"
  },
  {
    id:"i4", tag:"nyt adaptation", cuisine:"japanese", time:20,
    name:"miso butter pasta",
    why:"your miso linguine instinct formalized. this is the nyt version — miso and butter is one of the great flavor discoveries of the last decade.",
    source:"Adapted from NYT Cooking",
    components:["spaghetti","white miso + butter","parmigiano + black pepper"],
    recipe:"Cook pasta. In a pan, melt 3 tbsp butter. Whisk in 2 tbsp white miso until combined. Add ½ cup pasta water and simmer until slightly reduced. Toss in drained pasta. Off heat, add a generous handful of parmigiano and toss until creamy. Finish with coarsely cracked black pepper. The miso gives it umami depth that parm alone can't — it tastes like the best version of carbonara you've never had.",
    grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)"
  },
  {
    id:"i5", tag:"whoa factor", cuisine:"cantonese", time:20,
    name:"silken tofu with soy ginger sauce",
    why:"the simplest dish in this entire app. no cooking, three condiments, five minutes. the quality of the tofu is everything — this is why you go to hong kong supermarket.",
    source:"Classic Cantonese preparation",
    components:["silken tofu","soy sauce + sesame oil + ginger","scallion"],
    recipe:"Slide silken tofu carefully onto a plate — do not break it. Mix 2 tbsp soy sauce, 1 tsp sesame oil, 1 tsp freshly grated ginger, pinch of sugar. Pour over tofu. Top with thinly sliced scallion. Heat 1 tbsp neutral oil until shimmering, pour over the scallion — it will sizzle and wilt. Eat immediately with rice. That's the whole recipe.",
    grad:"linear-gradient(135deg,#c09090,#a87878)"
  },
  {
    id:"i6", tag:"nyt adaptation", cuisine:"italian", time:25,
    name:"pasta with brown butter and sage",
    why:"four ingredients. one technique — browning butter until nutty. the smell alone is a revelation.",
    source:"Adapted from NYT Cooking",
    components:["pappardelle or rigatoni","brown butter","fresh sage + parmigiano"],
    recipe:"Cook pasta. In a wide pan, melt 4 tbsp butter over medium heat and keep cooking, swirling, until it turns deep golden and smells nutty — about 4 min. Add 8-10 fresh sage leaves (they'll crisp immediately). Add ½ cup pasta water and swirl to emulsify. Add drained pasta and toss. Off heat, add generous parmigiano. Finish with fleur de sel. The browned butter is a different ingredient than regular butter — the nutty depth is extraordinary.",
    grad:"linear-gradient(135deg,#c9a87c,#b89068)"
  },
  {
    id:"i7", tag:"whoa factor", cuisine:"japanese", time:10,
    name:"soy marinated eggs",
    why:"make them sunday. eat them all week on rice, in ramen, for breakfast. the yolk turns jammy and the soy penetrates the white. a kitchen staple that makes everything better.",
    source:"Japanese ramen tradition",
    components:["eggs","soy sauce + mirin + sake","scallion + rice"],
    recipe:"Bring water to boil. Lower eggs gently, cook exactly 7 min. Transfer immediately to ice water, peel carefully. Mix ½ cup soy sauce, ¼ cup mirin, 2 tbsp sake in a zip-lock bag. Add peeled eggs. Marinate in the fridge minimum 4 hours, up to 24. The longer the better. Slice in half over rice — the yolk should be jammy and glossy. These make every weeknight better.",
    grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)"
  },
  {
    id:"i8", tag:"nyt adaptation", cuisine:"french", time:30,
    name:"leeks vinaigrette",
    why:"a bistro classic that takes 25 minutes and costs almost nothing. elegant enough for a dinner party, easy enough for a wednesday. david tanis's version is the definitive one.",
    source:"Adapted from NYT Cooking — David Tanis",
    components:["leeks","dijon vinaigrette","soft boiled egg + capers"],
    recipe:"Halve leeks lengthwise, wash thoroughly. Simmer in salted water 15 min until completely tender — they should be silky, not al dente. Drain and press gently. Make vinaigrette: 1 tbsp dijon, 1 tbsp red wine vinegar, 3 tbsp good olive oil, salt and pepper. Arrange leeks on a plate, spoon vinaigrette over. Top with roughly chopped soft boiled egg and capers. Serve warm or at room temperature as a starter or light lunch.",
    grad:"linear-gradient(135deg,#9b8ec4,#8070b0)"
  },
  {
    id:"i9", tag:"whoa factor", cuisine:"italian", time:20,
    name:"pasta aglio e olio",
    why:"the purest expression of italian cooking. garlic, olive oil, pasta water. the technique is everything — get the emulsion right and it's transcendent.",
    source:"Classic Neapolitan preparation",
    components:["spaghetti","garlic + good olive oil","chili flakes + parsley"],
    recipe:"Cook spaghetti. While it cooks, gently warm 6 thinly sliced garlic cloves in ½ cup good olive oil over very low heat — you want them golden and sweet, not brown. Add a pinch of chili flakes. Add ½ cup pasta water to the garlic oil and swirl. Drain pasta, add to pan, toss vigorously off heat adding more pasta water as needed until silky. Finish with flat leaf parsley. The pasta water emulsification is the technique. Use your best olive oil.",
    grad:"linear-gradient(135deg,#c9a87c,#b89068)"
  },
  {
    id:"i10", tag:"nyt adaptation", cuisine:"cantonese", time:30,
    name:"steamed fish with black bean sauce",
    why:"one of the great weeknight cantonese dishes. the fermented black beans add a depth that soy sauce alone can't get to.",
    source:"Classic Cantonese preparation",
    components:["sea bass or haddock","fermented black beans + ginger","scallion oil"],
    recipe:"Steam fish 8-10 min. Meanwhile, sauté 1 tbsp rinsed fermented black beans with minced ginger and garlic in oil 1 min until fragrant. Add 2 tbsp soy sauce, 1 tbsp shaoxing wine, 1 tsp sugar, and a splash of water. Simmer 2 min. Pour sauce over fish, top with julienned scallion and ginger. Heat oil until smoking, pour sizzling over everything. The fermented black beans are available on Weee — they are the ingredient that makes this dish.",
    grad:"linear-gradient(135deg,#c09090,#a87878)"
  },
  {
    id:"i11", tag:"whoa factor", cuisine:"simple", time:5,
    name:"broken egg salad",
    why:"jammy eggs broken over dressed arugula. the runny yolk becomes part of the dressing. the simplest lunch that feels like it belongs in a paris café.",
    source:"NYT Cooking inspiration",
    components:["jammy eggs","arugula + modena balsamic","fleur de sel + parmigiano"],
    recipe:"Soft boil eggs exactly 7 min, ice bath, peel. Dress arugula generously with good olive oil, Modena balsamic, and fleur de sel. Place eggs on top and break them open roughly with a fork — let the yolk run into the salad. Add parmigiano shavings. Eat immediately. This is lunch for you and Callan on a good day.",
    grad:"linear-gradient(135deg,#8fb5c4,#7aa0b0)"
  },
  {
    id:"i12", tag:"nyt adaptation", cuisine:"french", time:40,
    name:"slow roasted salmon",
    why:"the nyt version that changed how people cook salmon. low and slow gives you impossibly silky flesh — nothing like the pan-seared version. it looks underdone but it's perfect.",
    source:"Adapted from NYT Cooking",
    components:["salmon","good olive oil + lemon zest","fresh dill + fleur de sel"],
    recipe:"Bring salmon to room temperature. Rub generously with olive oil, lemon zest, salt, and pepper. Place on a foil-lined sheet pan. Roast at 275°F for 30-35 min — it will look barely cooked and almost translucent in the center. That is correct. The flesh should be silky and yield to a fork with almost no resistance. Finish with fresh dill and fleur de sel. Serve over arugula with Modena balsamic. This is a different dish than any salmon you've made before.",
    grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)"
  },
];

// ─── BREAKFASTS ───────────────────────────────────────────────────────────────

const BREAKFASTS = [
  { id:"b1", name:"belgian boys pancakes", detail:"fresh fruit · whole milk", source:"costco", fav:true,
    how:"Heat a non-stick pan on medium. Cook pancakes straight from the box 2-3 min per side until golden. Serve with sliced fruit and cold whole milk. Add maple syrup if the kids want it." },
  { id:"b2", name:"noosa yogurt bowl", detail:"seasonal fruit · honey", source:"costco", fav:true,
    how:"Spoon Noosa into bowls. Top with whatever fruit you have. Drizzle with honey. Done in 2 minutes. Kids love this one." },
  { id:"b3", name:"steamed cantonese egg", detail:"sesame oil · soy sauce · fruit on the side", source:"gopuff + weee", fav:true,
    how:"Beat 2 eggs with 1.5x their volume in warm water plus a pinch of salt. Strain through a sieve. Steam covered on low-medium heat 8-10 min until just set — it should wobble slightly. Drizzle with soy sauce and sesame oil." },
  { id:"b4", name:"fu zhou we pork bun", detail:"straight from the freezer", source:"freezer", fav:true,
    how:"Steam from frozen 12-15 min. Or microwave wrapped in a damp paper towel 90 seconds. Serve hot. The kids eat these every single time." },
  { id:"b5", name:"feta egg white omelet", detail:"cherry tomatoes · good coffee", source:"gopuff + freshdirect", fav:true,
    how:"Whisk 3-4 egg whites with salt and pepper. Pour into a buttered non-stick pan on medium-low. When edges set, crumble feta and add halved cherry tomatoes. Fold and slide onto a plate. Eat with really good coffee." },
  { id:"b6", name:"smoked salmon on sourdough", detail:"cream cheese · dried dill", source:"costco + city run", fav:true,
    how:"Toast sourdough. Spread generously with cream cheese. Layer Blue Hill Bay smoked salmon over the top. Finish with dried dill and cracked black pepper. No cooking." },
  { id:"b7", name:"tal's bagel", detail:"when you're passing by", source:"city run", fav:true,
    how:"Walk two blocks. Get a bagel. You know what to do." },
  { id:"b8", name:"miso butter toast", detail:"good bread · miso butter · honey", source:"weee + gopuff", fav:false,
    how:"Mix 1 tbsp softened butter with 1 tsp white miso until combined. Spread thickly on toast. Drizzle of honey on top. Takes 3 minutes and tastes like a Japanese breakfast café." },
  { id:"b9", name:"soft boiled eggs on rice", detail:"soy · sesame oil · leftover rice", source:"gopuff + weee", fav:false,
    how:"Bring water to boil. Lower eggs in gently, cook exactly 7 min. Ice water 1 min, peel carefully. Serve over warm leftover rice with soy sauce and sesame oil. Top with scallion." },
  { id:"b10", name:"fruit + cheese plate", detail:"whatever looks good · cheddar or brie", source:"costco + freshdirect", fav:false,
    how:"Slice whatever fruit you have. Add a wedge of good cheese. Arrange loosely on a board. Zero cooking, oddly satisfying, kids treat it like a snack plate." },
  { id:"b11", name:"avocado toast with egg", detail:"sourdough · olive oil · fleur de sel", source:"freshdirect + gopuff", fav:false,
    how:"Toast sourdough. Mash avocado with salt, lemon, and olive oil. Spread on toast. Top with a fried or poached egg. Finish with fleur de sel and chili flakes." },
  { id:"b12", name:"congee", detail:"leftover rice · ginger · soy", source:"weee + gopuff", fav:false,
    how:"Simmer leftover rice in 3x its volume of water on low 20-25 min until broken down and porridge-like. Season with soy sauce and sesame oil. Top with sliced ginger, scallion, and a soft boiled egg." },
];

// ─── LUNCHES ─────────────────────────────────────────────────────────────────

const LUNCHES = [
  { id:"l1", name:"genova tuna sandwich", detail:"jj casone bread · cheddar · mayo", source:"costco", fav:true,
    how:"Open the Genova tuna in olive oil — do not drain. Mix lightly with mayo. Layer on JJ Casone bread with cheddar. The olive oil from the can makes all the difference." },
  { id:"l2", name:"leftover pasta", detail:"the best lunch of the week", source:"dinner leftovers", fav:true,
    how:"Cold straight from the fridge is honestly great. Or warm in a pan with a splash of water and olive oil to loosen. Add parmigiano. Always the best lunch of the week." },
  { id:"l3", name:"arugula salad", detail:"modena balsamic · good olive oil", source:"freshdirect", fav:true,
    how:"Dress arugula with good olive oil, Modena balsamic, and fleur de sel. Add parmigiano shavings. Add any leftover protein on top if you want it more substantial." },
  { id:"l4", name:"leftover rice bowl", detail:"any protein · soy + sesame", source:"leftovers + weee", fav:true,
    how:"Warm leftover rice. Top with whatever protein is in the fridge. Drizzle with soy sauce and sesame oil. Scatter scallion on top." },
  { id:"l5", name:"soft scrambled egg toast", detail:"sourdough · scallion · fleur de sel", source:"gopuff + freshdirect", fav:true,
    how:"Melt butter in a non-stick pan on low. Add beaten eggs and stir constantly — you want them barely set and very creamy. Pull off heat while slightly wet. Pile onto toast, finish with fleur de sel and scallion." },
  { id:"l6", name:"broken egg salad", detail:"jammy eggs · arugula · modena balsamic", source:"freshdirect + gopuff", fav:false,
    how:"Soft boil eggs exactly 7 min. Dress arugula with olive oil, Modena balsamic, and fleur de sel. Place eggs on top and break them open — let the yolk run into the salad. Add parmigiano shavings. Eat immediately." },
  { id:"l7", name:"miso soup + rice", detail:"dashi · silken tofu · scallion", source:"weee", fav:false,
    how:"Simmer 1.5 cups water with 1 dashi packet. Remove from heat, whisk in 1.5 tbsp white miso. Add cubed silken tofu and scallion. Serve alongside warm rice. 10 minutes." },
  { id:"l8", name:"smashed cucumber salad", detail:"soy · sesame · rice vinegar · chili", source:"weee + freshdirect", fav:false,
    how:"Smash cucumbers with the flat of a knife, tear into rough pieces. Dress with soy sauce, rice vinegar, sesame oil, pinch of sugar, chili flakes. Let sit 5 min. Serve cold." },
  { id:"l9", name:"smoked salmon rice bowl", detail:"leftover rice · cream cheese · dill", source:"costco", fav:false,
    how:"Warm leftover rice. Top with torn smoked salmon, a spoonful of cream cheese, dried dill, and a drizzle of soy sauce and sesame oil. Finish with sliced scallion. 5 minutes." },
  { id:"l10", name:"simple tomato soup", detail:"canned tomatoes · good olive oil", source:"freshdirect", fav:false,
    how:"Sauté 2 garlic cloves in olive oil. Add one 28oz can of crushed tomatoes, salt, pinch of sugar. Simmer 15 min. Blend until smooth. Finish with good olive oil. Serve with JJ Casone bread." },
];

// ─── NYC FINDS ────────────────────────────────────────────────────────────────

const ALL_FINDS = [
  { tag:"italian",   name:"fresh burrata",        where:"Murray's Cheese · Bleecker St",    why:"one ingredient that turns a simple pasta night into something genuinely special.",              grad:"linear-gradient(135deg,#c9a87c,#b89068)" },
  { tag:"italian",   name:"san marzano tomatoes",  where:"Eataly · Flatiron",               why:"the pantry upgrade that makes every pasta sauce taste noticeably different.",                   grad:"linear-gradient(135deg,#c9a87c,#b89068)" },
  { tag:"italian",   name:"fresh pasta sheets",    where:"Eataly · Flatiron",               why:"fresh pasta takes a simple sauce and turns it into a weeknight that feels like a real dinner.", grad:"linear-gradient(135deg,#c9a87c,#b89068)" },
  { tag:"italian",   name:"nduja",                 where:"Eataly · Flatiron",               why:"spicy spreadable pork that melts into any pasta. a tiny amount goes a long way.",              grad:"linear-gradient(135deg,#c9a87c,#b89068)" },
  { tag:"japanese",  name:"dashi stock packets",   where:"Katagiri · East 59th St",         why:"unlocks oyakodon and cold soba in 20 min. the pantry staple that changes everything.",         grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)" },
  { tag:"japanese",  name:"yuzu kosho",            where:"Katagiri · East 59th St",         why:"a tiny jar that adds instant brightness and heat to any fish or chicken.",                     grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)" },
  { tag:"japanese",  name:"fresh ramen noodles",   where:"Sun Noodle via Weee",             why:"restaurant-quality noodles. miso broth + any costco protein = a genuinely great 20 min dinner.", grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)" },
  { tag:"japanese",  name:"white miso",            where:"Katagiri · East 59th St",         why:"one tub unlocks miso glazed salmon, miso soup, miso butter pasta. incredibly versatile.",      grad:"linear-gradient(135deg,#9fbfa8,#8aaa94)" },
  { tag:"french",    name:"beurre de baratte",     where:"Eataly · Flatiron",               why:"french cultured butter. makes pan sauce chicken taste like a parisian bistro.",                 grad:"linear-gradient(135deg,#9b8ec4,#8070b0)" },
  { tag:"french",    name:"castelvetrano olives",  where:"Eataly or FreshDirect",           why:"buttery and mild — not briny. the olive that converts people who don't like olives.",           grad:"linear-gradient(135deg,#9b8ec4,#8070b0)" },
  { tag:"french",    name:"dijon mustard",         where:"Fairway via Instacart",           why:"real french dijon in a pan sauce or vinaigrette instantly elevates weeknight cooking.",         grad:"linear-gradient(135deg,#9b8ec4,#8070b0)" },
  { tag:"cantonese", name:"fresh silken tofu",     where:"Hong Kong Supermarket · Canal St",why:"silkier than anything delivered. elevates your steamed egg and tofu pork bowl entirely.",      grad:"linear-gradient(135deg,#c09090,#a87878)" },
  { tag:"cantonese", name:"fermented black beans", where:"Weee delivery",                  why:"the ingredient behind the best cantonese steamed fish you've never made. one jar lasts months.", grad:"linear-gradient(135deg,#c09090,#a87878)" },
  { tag:"cantonese", name:"fresh pea shoots",      where:"Hong Kong Supermarket · Canal St",why:"better than anything on freshdirect. flash-stir-fried with garlic they are perfect.",          grad:"linear-gradient(135deg,#c09090,#a87878)" },
  { tag:"cantonese", name:"roasted pork belly",    where:"Big Wing Wong · Mott St",         why:"slice over rice with soy sauce for the easiest great dinner. chinatown haul worth making.",    grad:"linear-gradient(135deg,#c09090,#a87878)" },
  { tag:"pantry",    name:"fleur de sel",          where:"Eataly · Flatiron",               why:"finishing salt on salmon, eggs, or pasta is the tiny upgrade that makes everything taste intentional.", grad:"linear-gradient(135deg,#8fb5c4,#7aa0b0)" },
  { tag:"pantry",    name:"good olive oil",        where:"Eataly · Flatiron",               why:"one bottle of genuinely good olive oil changes the flavor of everything you drizzle it on.",   grad:"linear-gradient(135deg,#8fb5c4,#7aa0b0)" },
  { tag:"pantry",    name:"modena balsamic",       where:"Eataly · Flatiron",               why:"real aged balsamic on arugula is in a completely different category than grocery store stuff.", grad:"linear-gradient(135deg,#8fb5c4,#7aa0b0)" },
  { tag:"city run",  name:"fu zhou we pork buns",  where:"Fu Zhou We · East Broadway",      why:"50-bun haul. straight to the freezer. the best breakfast investment you can make.",            grad:"linear-gradient(135deg,#c8b8a0,#b8a890)" },
  { tag:"city run",  name:"tai pan bakery",        where:"Tai Pan Bakery · Canal St",       why:"egg tarts and pineapple buns the kids will genuinely love. grab a dozen downtown.",            grad:"linear-gradient(135deg,#c8b8a0,#b8a890)" },
  { tag:"city run",  name:"tal's bagels",          where:"Tal Bagels · UES",                why:"two blocks away and worth it. the best easy saturday morning you can give your family.",        grad:"linear-gradient(135deg,#c8b8a0,#b8a890)" },
];

const NYC_FINDS_DEFAULT = [ALL_FINDS[0], ALL_FINDS[4], ALL_FINDS[8], ALL_FINDS[11]];

// ─── SHOPPING ────────────────────────────────────────────────────────────────

const SHOPPING = {
  1:  { freshdirect:[{i:"cherry tomatoes",q:"1 pint"}], costco:[{i:"frozen shrimp",q:"1.5 lbs"},{i:"linguine",q:"1 lb"},{i:"parmigiano",q:"block"}], weee:[{i:"white miso",q:"1 tub"}] },
  2:  { freshdirect:[{i:"italian sausage",q:"1 lb"},{i:"lacinato kale",q:"1 bunch"}], costco:[{i:"orecchiette",q:"1 lb"},{i:"parmigiano",q:"block"}] },
  3:  { freshdirect:[{i:"fresh mozzarella",q:"8 oz"}], costco:[{i:"chicken meatballs",q:"1 bag"},{i:"rao's arrabiata",q:"1 jar"}] },
  4:  { freshdirect:[{i:"broccolini",q:"2 bunches"},{i:"scallions",q:"1 bunch"},{i:"fresh ginger",q:"2 inch piece"}], weee:[{i:"sea bass",q:"1.5 lbs"},{i:"soy sauce",q:"1 bottle"},{i:"sesame oil",q:"1 bottle"}], costco:[{i:"jasmine rice",q:"2 cups dry"}] },
  5:  { freshdirect:[{i:"pea shoots",q:"2 handfuls"}], weee:[{i:"silken tofu",q:"2 blocks"},{i:"minced pork",q:"0.5 lb"},{i:"soy sauce",q:"1 bottle"},{i:"sesame oil",q:"1 bottle"}] },
  6:  { freshdirect:[{i:"asparagus",q:"1 bunch"}], costco:[{i:"salmon portions",q:"4 pieces"}] },
  7:  { freshdirect:[{i:"yukon gold potato",q:"3 medium"}], weee:[{i:"japanese curry roux",q:"1 box"},{i:"kabocha squash",q:"1 small"}], costco:[{i:"chicken thighs",q:"1.5 lbs"},{i:"jasmine rice",q:"2 cups dry"}] },
  8:  { freshdirect:[{i:"fresh basil",q:"1 bunch"},{i:"cherry tomatoes",q:"1 pint"}], weee:[{i:"vodka sauce",q:"1 jar"}], costco:[{i:"chicken thighs",q:"1.5 lbs"}] },
  9:  { freshdirect:[{i:"baby bok choy",q:"2 heads"}], weee:[{i:"white miso",q:"1 tub"},{i:"mirin",q:"1 bottle"},{i:"sake",q:"1 bottle"}], costco:[{i:"salmon portions",q:"4 pieces"}] },
  10: { weee:[{i:"dashi packets",q:"1 box"},{i:"mirin",q:"1 bottle"},{i:"soy sauce",q:"1 bottle"}], costco:[{i:"chicken thighs",q:"1.5 lbs"},{i:"eggs",q:"6"},{i:"jasmine rice",q:"2 cups dry"}] },
  11: { freshdirect:[{i:"PEI mussels",q:"3 lbs"},{i:"flat leaf parsley",q:"1 bunch"},{i:"shallots",q:"2"}], costco:[{i:"white wine",q:"1 bottle"},{i:"sourdough bread",q:"1 loaf"}] },
  12: { freshdirect:[{i:"scallions",q:"1 bunch"},{i:"fresh ginger",q:"2 inch piece"}], weee:[{i:"sea bass",q:"1.5 lbs"},{i:"soy sauce",q:"1 bottle"},{i:"sesame oil",q:"1 bottle"}], costco:[{i:"jasmine rice",q:"2 cups dry"}] },
  13: { freshdirect:[{i:"haricots verts",q:"0.5 lb"},{i:"shallots",q:"3"},{i:"thyme",q:"a few sprigs"}], costco:[{i:"chicken thighs",q:"1.5 lbs"},{i:"white wine",q:"1 bottle"}] },
  14: { weee:[{i:"soba noodles",q:"2 bundles"},{i:"tsuyu concentrate",q:"1 bottle"},{i:"nori",q:"1 pack"}] },
  15: { weee:[{i:"pork belly",q:"1.5 lbs"},{i:"mirin",q:"1 bottle"},{i:"soy sauce",q:"1 bottle"},{i:"sake",q:"1 bottle"}], costco:[{i:"jasmine rice",q:"2 cups dry"}] },
  16: { freshdirect:[{i:"cherry tomatoes",q:"1 pint"},{i:"flat leaf parsley",q:"1 bunch"}], costco:[{i:"frozen shrimp",q:"1.5 lbs"},{i:"white wine",q:"1 bottle"}] },
  17: { freshdirect:[{i:"haddock fillets",q:"1.5 lbs"},{i:"baby bok choy",q:"2 heads"}], weee:[{i:"white miso",q:"1 tub"},{i:"mirin",q:"1 bottle"},{i:"sake",q:"1 bottle"}] },
  18: { costco:[{i:"chicken wing flats",q:"2 lbs"},{i:"teriyaki sauce",q:"1 bottle"}], weee:[{i:"sesame seeds",q:"1 bag"}], freshdirect:[{i:"scallions",q:"1 bunch"}] },
  19: { freshdirect:[{i:"baby bok choy",q:"2 heads"}], weee:[{i:"black cod portions",q:"1.5 lbs"},{i:"white miso",q:"1 tub"},{i:"mirin",q:"1 bottle"},{i:"sake",q:"1 bottle"}], costco:[{i:"jasmine rice",q:"2 cups dry"}] },
  20: { freshdirect:[{i:"haricots verts",q:"0.5 lb"},{i:"shallots",q:"2"}], costco:[{i:"hokkaido scallops",q:"1 lb"},{i:"unsalted butter",q:"1 block"}] },
  21: { freshdirect:[{i:"asparagus",q:"1 bunch"},{i:"monkfish fillets",q:"1.5 lbs"}], costco:[{i:"unsalted butter",q:"1 block"},{i:"capers",q:"1 jar"}] },
  22: { weee:[{i:"butter chicken sauce",q:"1 jar"}], costco:[{i:"chicken thighs",q:"1.5 lbs"},{i:"jasmine rice",q:"2 cups dry"}] },
};

const STAPLES = {
  gopuff:      [{i:"eggs",q:"1 dozen"},{i:"whole milk",q:"1 gallon"}],
  costco:      [{i:"noosa yogurt",q:"4 pack"},{i:"belgian boys pancakes",q:"1 box"},{i:"genova tuna",q:"3 cans"},{i:"jj casone bread",q:"1 loaf"},{i:"cream cheese",q:"8 oz"},{i:"cheddar",q:"block"}],
  freshdirect: [{i:"arugula",q:"5 oz bag"},{i:"cherry tomatoes",q:"1 pint"},{i:"fresh fruit",q:"for the week"},{i:"scallions",q:"1 bunch"}],
};

const SVC_GRADS = {
  freshdirect:"linear-gradient(135deg,#9fbfa8,#8fb0a0)",
  costco:"linear-gradient(135deg,#c9a87c,#b8966a)",
  weee:"linear-gradient(135deg,#c09090,#a87878)",
  gopuff:"linear-gradient(135deg,#9b8ec4,#8878b0)",
};
const SVC_LABELS = { freshdirect:"freshdirect", costco:"costco · instacart", weee:"weee", gopuff:"gopuff" };
const SVC_HINTS  = { freshdirect:null, costco:"tap items to copy · search manually in instacart", weee:null, gopuff:"tap items to copy · search manually in gopuff" };
const CC = { italian:"#c9a87c", cantonese:"#c09090", japanese:"#9fbfa8", french:"#9b8ec4", simple:"#8fb5c4" };

const TABS = [
  { id:"today",       icon:"⊙" },
  { id:"shop",        icon:"⊕" },
  { id:"inspire",     icon:"✦" },
  { id:"finds",       icon:"◈" },
  { id:"feedback",    icon:"◇" },
];

const EMPTY = { tab:"today", weekPlan:null, ratings:{}, notes:{} };

function loadSt() {
  try {
    const { ai:_, ...rest } = JSON.parse(localStorage.getItem("mise-v1")||"{}");
    return { ...EMPTY, ...rest };
  } catch { return EMPTY; }
}
function saveSt(s) {
  try { const { ai:_, ...r } = s; localStorage.setItem("mise-v1", JSON.stringify(r)); } catch {}
}

function pickMeals(ratings) {
  const all   = [...HITS, ...NEW_MEALS];
  const avail = all.filter(m => ratings[m.id] !== "skip");
  const loved = avail.filter(m => ratings[m.id] === "loved");
  const newMs = avail.filter(m => m.isNew && ratings[m.id] !== "loved");
  const used  = new Set(); const pool = [];
  const pick  = arr => {
    const f = arr.filter(m => !used.has(m.id));
    if (!f.length) return;
    const m = f[Math.floor(Math.random()*f.length)];
    used.add(m.id); pool.push(m);
  };
  loved.length ? pick(loved) : pick(avail);
  if (newMs.length) pick(newMs);
  while (pool.length < 3) { const f = avail.filter(m => !used.has(m.id)); if (!f.length) break; pick(f); }
  return pool.slice(0,3);
}

function buildList(meals) {
  const L = { freshdirect:{}, costco:{}, weee:{}, gopuff:{} };
  Object.entries(STAPLES).forEach(([svc,items]) => items.forEach(({i,q}) => { if(L[svc]) L[svc][i]=q; }));
  meals.forEach(m => {
    const s = SHOPPING[m.id]||{};
    Object.entries(s).forEach(([svc,items]) => { if(!L[svc]) return; items.forEach(({i,q}) => { if(!L[svc][i]) L[svc][i]=q; }); });
  });
  return Object.fromEntries(Object.entries(L).map(([k,v])=>[k,Object.entries(v).map(([i,q])=>({i,q}))]));
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function MealNoteInput({ mealId, saved, onSave, col }) {
  const [val, setVal] = useState(saved||"");
  const [ok,  setOk]  = useState(false);
  const save = () => { onSave(mealId,val); setOk(true); setTimeout(()=>setOk(false),1500); };
  return (
    <div style={{marginTop:16}} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:10,letterSpacing:2,color:col,marginBottom:8}}>your notes</div>
      <textarea value={val} onChange={e=>setVal(e.target.value)}
        placeholder="add miso next time · double the shrimp · kids loved this"
        rows={2}
        style={{width:"100%",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,
          padding:"10px 12px",fontSize:12,color:"#ccc",resize:"none",fontFamily:"inherit",
          lineHeight:1.6,outline:"none",marginBottom:8}}/>
      <div className="p" onClick={save}
        style={{display:"inline-block",fontSize:10,letterSpacing:2,
          color:ok?"#9fbfa8":col,background:"#1a1a1a",borderRadius:50,
          padding:"6px 14px",border:"1px solid #2a2a2a",transition:"color .2s"}}>
        {ok?"saved ✓":"save note"}
      </div>
    </div>
  );
}

function ExpandCard({ item, index, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`p u d${Math.min(index+1,5)}`} onClick={()=>setOpen(o=>!o)}
      style={{marginBottom:8,background:"#0e0e0e",borderRadius:16,overflow:"hidden",
        boxShadow:open?`inset 3px 0 0 ${accentColor}`:"inset 3px 0 0 #1a1a1a",transition:"box-shadow .2s"}}>
      <div style={{padding:"16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{fontSize:17,fontWeight:200,color:"#e8e6e0"}}>{item.name}</div>
              {!item.fav&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:"#ffffff09",color:accentColor,letterSpacing:1,flexShrink:0}}>new</span>}
            </div>
            <div style={{fontSize:11,color:"#777",lineHeight:1.5}}>{item.detail}</div>
          </div>
          <div style={{fontSize:10,letterSpacing:1,color:"#555",textAlign:"right",maxWidth:80,lineHeight:1.5,flexShrink:0,marginLeft:12}}>{item.source}</div>
        </div>
        {open&&item.how&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #1e1e1e"}}>
            <div style={{fontSize:10,letterSpacing:2,color:accentColor,marginBottom:8}}>how to make it</div>
            <div style={{fontSize:13,color:"#bbb",lineHeight:1.9}}>{item.how}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyItem({ itemName, qty }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    try { navigator.clipboard.writeText(itemName); } catch(e){}
    setCopied(true); setTimeout(()=>setCopied(false),1500);
  };
  return (
    <div className="p" onClick={handle}
      style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"10px 10px",borderRadius:10,marginBottom:2,background:"rgba(0,0,0,.06)"}}>
      <span style={{fontSize:14,fontWeight:300,color:"rgba(0,0,0,.8)",textTransform:"lowercase"}}>{itemName}</span>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:8}}>
        <span style={{fontSize:11,color:"rgba(0,0,0,.45)",letterSpacing:.5}}>{qty}</span>
        <span style={{fontSize:10,color:"rgba(0,0,0,.35)",letterSpacing:1.5,transition:"all .15s"}}>{copied?"✓":"copy"}</span>
      </div>
    </div>
  );
}

function InspirationCard({ r, index, ratings, onRate }) {
  const [open, setOpen] = useState(false);
  const col = CC[r.cuisine] || "#c8a96e";
  return (
    <div className={`p u d${Math.min(index+1,5)}`}
      onClick={()=>setOpen(o=>!o)}
      style={{marginBottom:12,background:"#0e0e0e",borderRadius:20,overflow:"hidden",
        boxShadow:open?`inset 3px 0 0 ${col}`:"inset 3px 0 0 #1a1a1a",transition:"box-shadow .2s"}}>
      <div style={{padding:"20px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:9,padding:"2px 8px",borderRadius:20,background:"#ffffff09",color:col,letterSpacing:1}}>{r.tag}</span>
            <span style={{fontSize:10,letterSpacing:2,color:"#555"}}>{r.cuisine}</span>
          </div>
          <span style={{fontSize:11,color:"#3a3a3a",flexShrink:0,marginLeft:8}}>{r.time} min</span>
        </div>
        <div style={{fontSize:22,fontWeight:200,color:"#e8e6e0",letterSpacing:-.3,marginBottom:8}}>{r.name}</div>
        <div style={{fontSize:13,color:"#777",lineHeight:1.6}}>{r.why}</div>
        {open&&(
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,color:"#555",marginBottom:14,fontStyle:"italic"}}>{r.source}</div>
            <div style={{fontSize:12,color:"#aaa",marginBottom:14,lineHeight:1.7}}>{r.components.join(" · ")}</div>
            <div style={{fontSize:10,letterSpacing:2,color:col,marginBottom:10}}>how to make it</div>
            <div style={{fontSize:13,color:"#bbb",lineHeight:1.9,paddingBottom:18,borderBottom:"1px solid #1e1e1e"}}>{r.recipe}</div>
            <div style={{marginTop:14,display:"flex",gap:8}}>
              {[["loved","♥ loved"],["liked","✓ liked"],["skip","✕ skip"]].map(([rv,label])=>(
                <div key={rv} className="p"
                  onClick={e=>{e.stopPropagation();onRate(r.id,rv);}}
                  style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:50,fontSize:11,letterSpacing:.5,transition:"all .15s",
                    background:ratings[r.id]===rv?"#e8e6e0":"#1a1a1a",
                    color:ratings[r.id]===rv?"#000":"#999",border:"1px solid #2a2a2a"}}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SimplifyInput({ col }) {
  const [val, setVal]     = useState("");
  const [result, setResult] = useState("");

  const simplify = () => {
    if (!val.trim()) return;
    const input = val.toLowerCase();
    const hasEgg=/egg|eggs|ajitsuke|ramen egg|marinated egg/.test(input);
    const hasSoy=/soy|shoyu|tamari/.test(input);
    const hasMiso=/miso/.test(input);
    const hasRamen=/ramen|noodle|soba|udon/.test(input);
    const hasCurry=/curry/.test(input);
    const hasDumpling=/dumpling|gyoza|wonton|dim sum/.test(input);
    const isFish=/salmon|sea bass|fish|cod|halibut|snapper|branzino|tuna|haddock/.test(input);
    const isShrimp=/shrimp|prawn/.test(input);
    const isScallop=/scallop/.test(input);
    const isMussel=/mussel|clam/.test(input);
    const isChicken=/chicken/.test(input);
    const isPork=/pork|belly|pancetta|guanciale|sausage/.test(input);
    const isBeef=/beef|steak|brisket|short rib/.test(input);
    const isTofu=/tofu/.test(input);
    const isAsian=/japanese|chinese|cantonese|korean|thai|asian|soy|miso|sesame|dashi|ramen|shoyu|tamari/.test(input);
    const isFrench=/french|bistro|beurre|confit|cassoulet|coq au vin|gratin|bouillabaisse|provençal|provencal/.test(input);
    const isItalian=/italian|pasta|risotto|gnocchi|carbonara|bolognese|ragù|ragu|pesto|arrabiata|amatriciana|cacio|aglio/.test(input);
    const isMelon=/bitter melon|bitter gourd|karela/.test(input);
    const isEggplant=/eggplant|aubergine/.test(input);
    const isMushroom=/mushroom|shiitake|oyster mushroom|king trumpet|porcini|chanterelle/.test(input);
    const isAsparagus=/asparagus/.test(input);
    const isBroccolini=/broccolini|broccoli/.test(input);
    const isPeaShoot=/pea shoot|pea leaves/.test(input);
    const isCorn=/corn/.test(input);
    const isBokChoy=/bok choy|pak choi/.test(input);
    const isLeek=/leek/.test(input);
    const isFennel=/fennel/.test(input);
    const isArugula=/arugula|rocket/.test(input);
    const isCauliflower=/cauliflower/.test(input);
    const isRadish=/radish|daikon|watermelon radish/.test(input);
    const isKale=/kale/.test(input);
    const isTomato=/tomato/.test(input);
    const isSquash=/butternut|delicata|acorn squash|squash|pumpkin|kabocha/.test(input);
    const isZucchini=/zucchini|courgette/.test(input);
    const isPotato=/potato|sweet potato/.test(input);
    const isCabbage=/cabbage|napa/.test(input);

    let s="";
    if(isMelon&&/bitter/.test(input)) s="bitter melon · stir-fried with minced pork, garlic, and oyster sauce · steamed rice. slice thin, salt and squeeze to draw out bitterness. one of the great cantonese weeknight dishes. 20 min.";
    else if(isRadish) s="watermelon radish · slice paper thin on a mandoline · dress with rice vinegar, sesame oil, and fleur de sel. the color is vivid, the crunch is everything. or quick-pickle in rice vinegar, sugar, and salt — keep a jar in the fridge all week. 5 min.";
    else if(isEggplant) s="eggplant · roasted whole until collapsed, then torn · dress with miso + sesame or olive oil + garlic + tomato. silky, smoky, almost no work. 30 min.";
    else if(isMushroom) s="mushrooms · seared hard in butter until golden, no stirring · finish with garlic, thyme, and a splash of white wine or soy. serve over rice, pasta, or toast. 15 min.";
    else if(isAsparagus) s="asparagus · roasted at 425°F with olive oil and salt · finish with lemon zest and parmigiano or a soft egg on top. 15 min.";
    else if(isBroccolini) s="broccolini · blanched 2 min then seared in a hot pan · finish with garlic, chili flakes, and olive oil or oyster sauce and sesame. 15 min.";
    else if(isPeaShoot) s="pea shoots · flash stir-fried in a very hot wok with garlic and a splash of shaoxing wine · salt and sesame oil to finish. one of the fastest great dishes you can make. 8 min.";
    else if(isCorn) s="corn · cut off the cob and seared in butter until charred · finish with miso butter or cotija + lime + chili. works as a side or tossed through pasta. 15 min.";
    else if(isBokChoy) s="bok choy · halved and seared cut-side down in sesame oil · add oyster sauce + a splash of water, cover 2 min · finish with garlic. 10 min.";
    else if(isLeek) s="leeks · slow-braised in butter until completely soft and sweet · finish with white wine, thyme, and a soft egg on top. incredible on toast. 25 min.";
    else if(isFennel) s="fennel · sliced thin and roasted until caramelized · dress with olive oil, lemon, and shaved parmigiano. or braise with white wine alongside fish. 30 min.";
    else if(isArugula) s="arugula · dressed with olive oil, modena balsamic, and fleur de sel · add parmigiano shavings and any leftover protein. or wilt briefly into hot pasta at the very end. 5 min.";
    else if(isCauliflower) s="cauliflower · roasted at 450°F until very dark and caramelized · finish with tahini + lemon or curry butter. transforms completely with high heat. 30 min.";
    else if(isKale) s="kale · massaged with olive oil and lemon until soft · toss with parmigiano and toasted breadcrumbs. or wilt into pasta with sausage. 10 min.";
    else if(isTomato) s="tomatoes · roasted slowly at 300°F with olive oil, garlic, and thyme until concentrated · toss through pasta or serve with burrata and good bread. 45 min hands-off, 10 min active.";
    else if(isZucchini) s="zucchini · sliced thin and fried in olive oil until golden · layer with torn basil, garlic, and parmigiano. the neapolitan way. 20 min.";
    else if(isSquash) s="kabocha or butternut · microwave whole 4 min to soften, then cut and roast chunks at 425°F · finish with miso butter or brown butter and sage. 35 min.";
    else if(isPotato) s="potatoes · sliced and roasted at 425°F with olive oil, garlic, and rosemary until crispy · or boiled and crushed with butter and chives. 35 min.";
    else if(isCabbage) s="napa cabbage · stir-fried with garlic, ginger, and oyster sauce · or braised slowly until silky with pork belly. one of the most underrated weeknight vegetables. 15 min.";
    else if(hasEgg&&hasSoy) s="soy-marinated eggs · steamed rice · sautéed pea shoots with garlic. make the eggs the night before — soak in soy, mirin, and sake for at least 4 hours. 20 min active.";
    else if(hasEgg&&hasMiso) s="soft scrambled eggs · miso butter on toast · sliced scallion and sesame oil. miso into your butter before scrambling. 10 min.";
    else if(hasEgg&&isAsian) s="steamed cantonese egg · soy sauce + sesame oil · jasmine rice. beat eggs with 1.5x volume warm water, strain, steam 8-10 min. 15 min.";
    else if(hasRamen&&hasMiso) s="fresh ramen noodles from weee · miso broth (miso + dashi + hot water) · soft boiled egg + scallion. 20 min.";
    else if(hasRamen) s="ramen noodles · store-bought broth + miso or soy · soft boiled egg + whatever protein you have. 20 min.";
    else if(hasCurry&&isAsian) s="japanese curry roux from weee · chicken thigh + potato + kabocha · steamed jasmine rice. the box does the work. 35 min.";
    else if(hasDumpling) s="store-bought dumplings (weee or freezer) · chili oil + black vinegar dipping sauce · simple cucumber salad. 15 min.";
    else if(hasMiso&&isFish) s="fish fillet · white miso + mirin + honey glaze · steamed bok choy. pat completely dry, marinate 15-20 min, broil on high 8-10 min. 25 min.";
    else if(hasMiso&&isChicken) s="chicken thighs · white miso + sake + mirin glaze · jasmine rice. broil until deeply caramelized. 25 min.";
    else if(hasMiso) s="your protein · white miso + mirin + touch of honey glaze · one green vegetable. miso is the sauce. 20-25 min.";
    else if(hasSoy&&isFish) s="steamed or pan-seared fish · soy + sesame + ginger sauce · jasmine rice. pour the hot sauce over at the end. 20 min.";
    else if(hasSoy&&isPork) s="pork belly or tenderloin · soy + mirin + sake glaze · steamed rice + pea shoots. 30 min.";
    else if(hasSoy&&isChicken) s="chicken thighs · soy + mirin + ginger · jasmine rice. marinate briefly, cook in the sauce. 25 min.";
    else if(hasSoy) s="your protein · soy + sesame oil + ginger sauce · jasmine rice or noodles. 20 min.";
    else if(isFrench&&isChicken) s="seared chicken thighs · shallot + white wine pan sauce · haricots verts. deglaze the pan after searing — the fond is the sauce. 35 min.";
    else if(isFrench&&isFish) s="pan-seared fish fillet · herb butter sauce (butter + tarragon + lemon) · roasted asparagus. 20 min.";
    else if(isFrench&&isMussel) s="mussels · white wine + shallot + butter broth · crusty bread. 20 min.";
    else if(isFrench) s="your protein · shallot + white wine + cold butter pan sauce · one simple vegetable. 30 min.";
    else if(isItalian&&isShrimp) s="linguine · shrimp + garlic + miso + olive oil · parsley and parm. 20 min.";
    else if(isItalian&&isPork) s="orecchiette · italian sausage + kale + parmigiano · olive oil. 30 min.";
    else if(isItalian) s="pasta · one good sauce · parmigiano + fresh basil. 20 min.";
    else if(isFish) s="pan-seared or broiled fish fillet · miso glaze or herb butter · one roasted vegetable. 20 min.";
    else if(isShrimp) s="shrimp · garlic + butter + white miso or soy + sesame · pasta or rice. 15 min.";
    else if(isScallop) s="seared scallops · brown butter + lemon + capers · simple green vegetable. pat completely dry before searing — essential. 15 min.";
    else if(isChicken) s="chicken thighs · one good sauce or glaze · simple vegetable or grain. 30 min.";
    else if(isPork) s="pork tenderloin · soy + mirin glaze or pan sauce · steamed rice + pea shoots. 30 min.";
    else if(isBeef) s="seared steak or short rib · pan sauce or soy glaze · roasted vegetable or rice. 30 min.";
    else if(isTofu) s="silken tofu · soy + sesame oil + ginger + scallion · steamed rice. pour hot oil over at the end. 15 min.";
    else s="keep the hero ingredient · pick one sauce or seasoning you already have · pair with rice, pasta, or one vegetable. goal: 3 components, 25 min.";

    setResult(s);
  };

  return (
    <div style={{marginTop:24,background:"#0e0e0e",borderRadius:20,padding:"20px 20px"}} onClick={e=>e.stopPropagation()}>
      <div style={{fontSize:10,letterSpacing:2,color:col,marginBottom:10}}>make it weeknight</div>
      <div style={{fontSize:13,color:"#777",marginBottom:12,lineHeight:1.5}}>one ingredient, a dish you saw, or something you ate — get a simple version.</div>
      <textarea value={val} onChange={e=>setVal(e.target.value)}
        placeholder="e.g. bitter melon · watermelon radish · miso ramen from ippudo"
        rows={2}
        style={{width:"100%",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,
          padding:"10px 12px",fontSize:12,color:"#ccc",resize:"none",fontFamily:"inherit",
          lineHeight:1.6,outline:"none",marginBottom:10}}/>
      {result&&(
        <div style={{fontSize:13,color:"#bbb",lineHeight:1.8,marginBottom:12,padding:"10px 12px",
          background:"#1a1a1a",borderRadius:10,borderLeft:`2px solid ${col}`}}>
          {result}
        </div>
      )}
      <div className="p" onClick={simplify}
        style={{background:"#e8e6e0",borderRadius:50,padding:"11px 22px",fontSize:11,
          letterSpacing:2,color:"#000",textAlign:"center",cursor:"pointer"}}>
        simplify →
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Mise() {
  const [st,  setSt]  = useState(loadSt);
  const [gen, setGen] = useState(false);
  const [exp, setExp] = useState(null);
  const [ai,  setAi]  = useState(null);
  const [aiL, setAiL] = useState(false);
  const [inspFilter, setInspFilter] = useState("all");

  useEffect(()=>saveSt(st),[st]);
  const upd = useCallback(p=>setSt(s=>({...s,...p})),[]);

  const generate = async () => {
    setGen(true);
    await new Promise(r=>setTimeout(r,900));
    const meals   = pickMeals(st.ratings);
    const shopping= buildList(meals);
    const shuffle = arr=>[...arr].sort(()=>Math.random()-.5);
    const bfasts  = shuffle([...BREAKFASTS.filter(b=>b.fav).slice(0,3),...shuffle(BREAKFASTS.filter(b=>!b.fav)).slice(0,2)]);
    const lunches = shuffle([...LUNCHES.filter(l=>l.fav).slice(0,3),...shuffle(LUNCHES.filter(l=>!l.fav)).slice(0,2)]);
    upd({ weekPlan:{ meals, shopping, bfasts, lunches, date:new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}) } });
    setGen(false);
  };

  const rate    = (id,r) => upd({ ratings:{...st.ratings,[id]:r} });

  const getFinds = () => {
    setAiL(true); setAi(null);
    const all=[...HITS,...NEW_MEALS];
    const loved=all.filter(m=>st.ratings[m.id]==="loved");
    const liked=all.filter(m=>st.ratings[m.id]==="liked");
    const cs={};
    [...loved,...liked].forEach(m=>{ cs[m.cuisine]=(cs[m.cuisine]||0)+(st.ratings[m.id]==="loved"?2:1); });
    const top1=Object.entries(cs).sort((a,b)=>b[1]-a[1])[0]?.[0]||"italian";
    const top2=Object.entries(cs).sort((a,b)=>b[1]-a[1])[1]?.[0]||"japanese";
    const shuffle=arr=>[...arr].sort(()=>Math.random()-.5);
    const fromC=(tag,n)=>shuffle(ALL_FINDS.filter(f=>f.tag===tag)).slice(0,n);
    const city=shuffle(ALL_FINDS.filter(f=>f.tag==="city run"||f.tag==="pantry")).slice(0,1);
    const picks=[...fromC(top1,2),...fromC(top2,1),...city].slice(0,4);
    setTimeout(()=>{ setAi({finds:picks}); setAiL(false); },400);
  };

  const T = (s,extra={})=><div style={{fontSize:11,letterSpacing:2.5,color:"#777",...extra}}>{s}</div>;

  const cuisineFilters = ["all","italian","japanese","cantonese","french","simple"];
  const filteredInspiration = inspFilter==="all"
    ? INSPIRATION
    : INSPIRATION.filter(r=>r.cuisine===inspFilter);

  return (
    <div style={{background:"#000",minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",overflowX:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        .p{transition:opacity .12s ease;cursor:pointer}
        .p:active{opacity:.6}
        @keyframes up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .u{animation:up .4s ease forwards;opacity:0}
        .d1{animation-delay:.04s}.d2{animation-delay:.08s}.d3{animation-delay:.12s}.d4{animation-delay:.16s}.d5{animation-delay:.20s}
        textarea{color-scheme:dark}
        .filter-scroll{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
      `}</style>

      {/* HEADER */}
      <div style={{padding:"56px 28px 0"}}>
        {T(new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}))}
        <div style={{fontSize:44,fontWeight:200,color:"#e8e6e0",letterSpacing:-2,lineHeight:1.05,marginTop:8}}>
          mise<span style={{color:"#c8c8a0",fontStyle:"italic"}}>.</span>
        </div>
      </div>

      {/* PILL TOGGLE */}
      <div style={{margin:"28px 28px 0"}}>
        <div style={{background:"#181818",borderRadius:50,padding:3,display:"flex"}}>
          {TABS.slice(0,2).map(t=>(
            <div key={t.id} className="p" onClick={()=>upd({tab:t.id})}
              style={{flex:1,padding:"11px 0",textAlign:"center",borderRadius:50,fontSize:13,letterSpacing:.5,transition:"all .2s",
                background:st.tab===t.id?"#e8e6e0":"transparent",
                color:st.tab===t.id?"#000":"#555",fontWeight:st.tab===t.id?500:400}}>
              {t.id}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:"28px 22px 110px"}}>

        {/* ── TODAY ── */}
        {st.tab==="today"&&(
          <div>
            <div className="p u" onClick={!gen?generate:undefined}
              style={{borderRadius:24,overflow:"hidden",marginBottom:20,
                background:gen?"#111":"linear-gradient(135deg,#aed4b0 0%,#b8d0a8 30%,#d4c8a4 65%,#c8b49a 100%)",
                minHeight:160,padding:"28px 24px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              {T(gen?"finding the right meals…":st.weekPlan?"ready to mix it up?":"let's plan your week.",{color:gen?"#666":"rgba(0,0,0,.4)"})}
              <div style={{fontSize:28,fontWeight:200,color:gen?"#333":"#0a180a",letterSpacing:-.8,lineHeight:1.15,marginTop:10}}>
                {gen?"building your week.":st.weekPlan?"plan a new week.":"generate this week's plan."}
              </div>
              {!gen&&<div style={{marginTop:20,width:40,height:40,borderRadius:50,background:"rgba(0,0,0,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"rgba(0,0,0,.5)"}}>✦</div>}
            </div>

            {st.weekPlan&&(<>
              {T(st.weekPlan.date,{marginBottom:24})}

              {T("this week's dinners",{letterSpacing:3,marginBottom:14})}
              {st.weekPlan.meals.map((meal,i)=>{
                const isExp=exp===meal.id;
                const col=CC[meal.cuisine]||"#c8a96e";
                const full=[...HITS,...NEW_MEALS].find(m=>m.id===meal.id)||meal;
                return (
                  <div key={meal.id} className={`p u d${i+1}`}
                    onClick={()=>setExp(isExp?null:meal.id)}
                    style={{marginBottom:10,background:"#0e0e0e",borderRadius:20,overflow:"hidden",
                      boxShadow:isExp?`inset 3px 0 0 ${col}`:"inset 3px 0 0 #1a1a1a",transition:"box-shadow .2s"}}>
                    <div style={{padding:"20px 20px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <span style={{fontSize:10,letterSpacing:2,color:col}}>{meal.cuisine}</span>
                          {meal.isNew&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:20,background:"#ffffff09",color:"#c8c8a0",letterSpacing:1}}>new</span>}
                        </div>
                        <span style={{fontSize:11,color:"#3a3a3a"}}>{meal.time} min</span>
                      </div>
                      <div style={{fontSize:21,fontWeight:200,color:"#e8e6e0",letterSpacing:-.3,lineHeight:1.2}}>{meal.name}</div>
                      {isExp&&(
                        <div style={{marginTop:14}}>
                          <div style={{fontSize:12,color:"#aaa",marginBottom:16,lineHeight:1.7,letterSpacing:.3}}>{full.components.join(" · ")}</div>
                          <div style={{fontSize:10,letterSpacing:2,color:col,marginBottom:10}}>how to make it</div>
                          <div style={{fontSize:13,color:"#bbb",lineHeight:1.9,marginBottom:20,paddingBottom:18,borderBottom:"1px solid #1e1e1e"}}>{full.recipe||"recipe coming soon."}</div>
                          <div style={{display:"flex",gap:8,marginBottom:0}}>
                            {[["loved","♥ loved"],["liked","✓ liked"],["skip","✕ skip"]].map(([r,label])=>(
                              <div key={r} className="p"
                                onClick={e=>{e.stopPropagation();rate(meal.id,r);}}
                                style={{flex:1,padding:"9px 0",textAlign:"center",borderRadius:50,fontSize:11,letterSpacing:.5,transition:"all .15s",
                                  background:st.ratings[meal.id]===r?"#e8e6e0":"#1a1a1a",
                                  color:st.ratings[meal.id]===r?"#000":"#999",border:"1px solid #2a2a2a"}}>
                                {label}
                              </div>
                            ))}
                          </div>
                          <MealNoteInput mealId={meal.id} saved={st.notes?.[meal.id]} col={col}
                            onSave={(id,text)=>upd({notes:{...st.notes,[id]:text}})}/>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div style={{height:32}}/>
              {T("breakfast rotation",{letterSpacing:3,marginBottom:14})}
              {st.weekPlan.bfasts.map((b,i)=><ExpandCard key={b.id} item={b} index={i} accentColor="#c8c8a0"/>)}

              <div style={{height:32}}/>
              {T("lunch this week",{letterSpacing:3,marginBottom:14})}
              {st.weekPlan.lunches.map((l,i)=><ExpandCard key={l.id} item={l} index={i} accentColor="#9fbfa8"/>)}
            </>)}
          </div>
        )}

        {/* ── SHOP ── */}
        {st.tab==="shop"&&(
          <div>
            <div style={{fontSize:44,fontWeight:200,color:"#e8e6e0",letterSpacing:-2,marginBottom:8}}>shop</div>
            <div style={{fontSize:14,fontWeight:200,color:"#888",marginBottom:32,lineHeight:1.6}}>tap any item to search it in the store. copy the full list to paste into the app.</div>
            {!st.weekPlan&&<div style={{fontSize:15,fontWeight:200,color:"#888",lineHeight:1.6}}>generate a plan first —<br/>your list will appear here.</div>}
            {st.weekPlan&&Object.entries(st.weekPlan.shopping).map(([svc,items],si)=>{
              if(!items?.length) return null;
              const searchUrl=(store,item)=>{
                const q=encodeURIComponent(item);
                if(store==="freshdirect") return `https://www.freshdirect.com/search?search=${q}`;
                if(store==="weee")        return `https://www.sayweee.com/en/search?keyword=${q}`;
                if(store==="costco")      return `https://www.instacart.com/store/costco/storefront`;
                if(store==="gopuff")      return `https://gopuff.com`;
                return "#";
              };
              const storeHome={
                freshdirect:"https://www.freshdirect.com",
                costco:"https://www.instacart.com/store/costco/storefront",
                weee:"https://www.sayweee.com/en",
                gopuff:"https://gopuff.com"
              };
              const fullText=`${SVC_LABELS[svc].toUpperCase()}\n`+items.map(({i,q})=>`• ${i} — ${q}`).join("\n");
              return (
                <div key={svc} className={`u d${si+1}`} style={{marginBottom:12}}>
                  <div style={{background:SVC_GRADS[svc],borderRadius:20,overflow:"hidden"}}>
                    <div style={{padding:"18px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
                      {T(SVC_LABELS[svc],{color:"rgba(0,0,0,.55)",letterSpacing:3,marginBottom:0})}
                      <div style={{display:"flex",gap:8}}>
                        <div className="p" onClick={()=>{try{navigator.clipboard.writeText(fullText);}catch(e){}}}
                          style={{fontSize:10,letterSpacing:1,color:"rgba(0,0,0,.65)",background:"rgba(0,0,0,.12)",borderRadius:50,padding:"6px 14px",cursor:"pointer",whiteSpace:"nowrap"}}>
                          copy all
                        </div>
                        <a href={storeHome[svc]} target="_blank" rel="noreferrer"
                          style={{fontSize:10,letterSpacing:1.5,color:"rgba(0,0,0,.65)",background:"rgba(0,0,0,.12)",borderRadius:50,padding:"6px 14px",textDecoration:"none",whiteSpace:"nowrap"}}>
                          open &thinsp;→
                        </a>
                      </div>
                    </div>
                    {SVC_HINTS[svc]&&<div style={{padding:"8px 20px 0",fontSize:10,letterSpacing:1.5,color:"rgba(0,0,0,.4)"}}>{SVC_HINTS[svc]}</div>}
                    <div style={{padding:"8px 12px 14px"}}>
                      {items.map(({i:itemName,q:qty},ii)=>{
                        const hasSearch=svc==="freshdirect"||svc==="weee";
                        return hasSearch?(
                          <a key={ii} href={searchUrl(svc,itemName)} target="_blank" rel="noreferrer"
                            style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                              padding:"10px 10px",borderRadius:10,marginBottom:2,textDecoration:"none",background:"rgba(0,0,0,.06)"}}>
                            <span style={{fontSize:14,fontWeight:300,color:"rgba(0,0,0,.8)",textTransform:"lowercase"}}>{itemName}</span>
                            <span style={{fontSize:11,color:"rgba(0,0,0,.45)",marginLeft:8,flexShrink:0,letterSpacing:.5}}>{qty} &thinsp;→</span>
                          </a>
                        ):(
                          <CopyItem key={ii} itemName={itemName} qty={qty}/>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            {st.weekPlan&&(
              <div className="p u" onClick={()=>{try{const all=Object.entries(st.weekPlan.shopping).filter(([,v])=>v?.length).map(([k,v])=>`${SVC_LABELS[k].toUpperCase()}\n${v.map(({i,q})=>`• ${i} — ${q}`).join("\n")}`).join("\n\n");navigator.clipboard.writeText(all);}catch(e){}}}
                style={{marginBottom:12,background:"#0e0e0e",borderRadius:20,padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:200,color:"#e8e6e0"}}>copy everything</div>
                  <div style={{fontSize:11,color:"#777",marginTop:3}}>all stores · paste anywhere</div>
                </div>
                <div style={{fontSize:20,color:"#777"}}>⊕</div>
              </div>
            )}
            <div className="u" style={{marginTop:4,background:"#0e0e0e",borderRadius:20,padding:"22px"}}>
              {T("city runs · as needed",{letterSpacing:3,marginBottom:16})}
              {[{name:"fu zhou we · 50 bun haul",note:"when freezer runs low",url:"https://maps.google.com/?q=Fu+Zhou+We+Chinatown+Manhattan"},
                {name:"tal's bagels",note:"when you're passing by",url:"https://maps.google.com/?q=Tal+Bagels+New+York"},
                {name:"breads bakery",note:"near union square",url:"https://maps.google.com/?q=Breads+Bakery+New+York"}
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:12,marginBottom:i<2?12:0,borderBottom:i<2?"1px solid #181818":"none"}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:200,color:"#e8e6e0"}}>{s.name}</div>
                    <div style={{fontSize:11,color:"#777",marginTop:2}}>{s.note}</div>
                  </div>
                  <a href={s.url} target="_blank" rel="noreferrer"
                    style={{fontSize:10,letterSpacing:1,color:"#888",background:"#1a1a1a",borderRadius:50,padding:"6px 14px",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0,marginLeft:12}}>
                    map →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INSPIRE ── */}
        {st.tab==="inspire"&&(
          <div>
            <div style={{fontSize:44,fontWeight:200,color:"#e8e6e0",letterSpacing:-2,marginBottom:8}}>inspire</div>
            <div style={{fontSize:14,fontWeight:200,color:"#888",marginBottom:24,lineHeight:1.6}}>
              adaptations worth making. nyt recipes, classics, and a few discoveries — all stripped to their weeknight essence.
            </div>

            {/* cuisine filter */}
            <div className="filter-scroll" style={{marginBottom:24}}>
              {cuisineFilters.map(f=>(
                <div key={f} className="p"
                  onClick={()=>setInspFilter(f)}
                  style={{padding:"8px 16px",borderRadius:50,fontSize:11,letterSpacing:1.5,whiteSpace:"nowrap",flexShrink:0,transition:"all .2s",
                    background:inspFilter===f?"#e8e6e0":"#111",
                    color:inspFilter===f?"#000":"#666",border:"1px solid #222"}}>
                  {f}
                </div>
              ))}
            </div>

            {filteredInspiration.map((r,i)=>(
              <InspirationCard key={r.id} r={r} index={i} ratings={st.ratings} onRate={rate}/>
            ))}

            <SimplifyInput col="#c8c8a0"/>
          </div>
        )}

        {/* ── FINDS ── */}
        {st.tab==="finds"&&(
          <div>
            <div style={{fontSize:44,fontWeight:200,color:"#e8e6e0",letterSpacing:-2,marginBottom:8}}>finds</div>
            <div style={{fontSize:14,fontWeight:200,color:"#888",marginBottom:24,lineHeight:1.6}}>intentional city runs that transform your weeknight cooking.</div>

            <div className="p u" onClick={!aiL?getFinds:undefined}
              style={{marginBottom:24,background:"#0e0e0e",borderRadius:50,padding:"13px 22px",
                display:"flex",justifyContent:"space-between",alignItems:"center",
                opacity:aiL?.5:1,cursor:aiL?"default":"pointer"}}>
              <span style={{fontSize:12,letterSpacing:2,color:"#e8e6e0"}}>{aiL?"finding good spots…":"refresh finds"}</span>
              <span style={{fontSize:14,color:"#666"}}>↻</span>
            </div>

            {(ai&&typeof ai==="object"&&ai.finds?ai.finds:NYC_FINDS_DEFAULT).map((find,i)=>(
              <div key={i} className={`u d${Math.min(i+1,5)}`} style={{marginBottom:10}}>
                <div style={{background:find.grad,borderRadius:24,padding:"24px 22px"}}>
                  {T(find.tag,{color:"rgba(0,0,0,.55)",letterSpacing:3,marginBottom:10})}
                  <div style={{fontSize:24,fontWeight:200,color:"#0a0a0a",letterSpacing:-.5,marginBottom:6}}>{find.name}</div>
                  <div style={{fontSize:11,color:"rgba(0,0,0,.55)",marginBottom:12}}>📍 {find.where}</div>
                  <div style={{fontSize:13,fontWeight:200,color:"rgba(0,0,0,.7)",lineHeight:1.7}}>{find.why}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {st.tab==="feedback"&&(
          <div>
            <div style={{fontSize:44,fontWeight:200,color:"#e8e6e0",letterSpacing:-2,marginBottom:8}}>feedback</div>
            <div style={{fontSize:14,fontWeight:200,color:"#888",marginBottom:32,lineHeight:1.6}}>the more you rate, the smarter your plan gets.</div>

            {T("your hits",{letterSpacing:3,marginBottom:14})}
            {HITS.map((meal,i)=>{
              const col=CC[meal.cuisine]||"#c8a96e";
              return (
                <div key={meal.id} className={`u d${Math.min(i+1,5)}`}
                  style={{marginBottom:8,background:"#0e0e0e",borderRadius:18,padding:"16px 18px"}}>
                  <div style={{fontSize:16,fontWeight:200,color:"#e8e6e0",marginBottom:6}}>{meal.name}</div>
                  <div style={{fontSize:11,color:"#888",marginBottom:12,lineHeight:1.6}}>{meal.cuisine} · {meal.time} min</div>
                  <div style={{display:"flex",gap:8}}>
                    {[["loved","♥ loved"],["liked","✓ liked"],["skip","✕ skip"]].map(([r,label])=>(
                      <div key={r} className="p" onClick={()=>rate(meal.id,r)}
                        style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:50,fontSize:11,letterSpacing:.5,transition:"all .15s",
                          background:st.ratings[meal.id]===r?"#e8e6e0":"#1a1a1a",
                          color:st.ratings[meal.id]===r?"#000":"#999",border:"1px solid #2a2a2a"}}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{height:32}}/>
            {T("new directions",{letterSpacing:3,marginBottom:14})}
            {NEW_MEALS.map((meal,i)=>{
              const col=CC[meal.cuisine]||"#c8a96e";
              return (
                <div key={meal.id} className={`u d${Math.min(i+1,5)}`}
                  style={{marginBottom:8,background:"#0e0e0e",borderRadius:18,padding:"16px 18px",boxShadow:`inset 3px 0 0 ${col}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{fontSize:16,fontWeight:200,color:"#e8e6e0"}}>{meal.name}</div>
                    <span style={{fontSize:9,padding:"2px 8px",borderRadius:20,background:"#ffffff08",color:"#c8c8a0",letterSpacing:1,marginLeft:8,flexShrink:0}}>new</span>
                  </div>
                  <div style={{fontSize:11,color:"#888",marginBottom:12,lineHeight:1.6}}>{meal.cuisine} · {meal.time} min · {meal.components.join(", ")}</div>
                  <div style={{display:"flex",gap:8}}>
                    {[["loved","♥ loved"],["liked","✓ liked"],["skip","✕ skip"]].map(([r,label])=>(
                      <div key={r} className="p" onClick={()=>rate(meal.id,r)}
                        style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:50,fontSize:11,letterSpacing:.5,transition:"all .15s",
                          background:st.ratings[meal.id]===r?"#e8e6e0":"#1a1a1a",
                          color:st.ratings[meal.id]===r?"#000":"#999",border:"1px solid #2a2a2a"}}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{height:32}}/>
            {T("inspiration ratings",{letterSpacing:3,marginBottom:14})}
            {INSPIRATION.map((r,i)=>{
              const col=CC[r.cuisine]||"#c8a96e";
              return (
                <div key={r.id} className={`u d${Math.min(i+1,5)}`}
                  style={{marginBottom:8,background:"#0e0e0e",borderRadius:18,padding:"16px 18px",boxShadow:`inset 3px 0 0 ${col}`}}>
                  <div style={{fontSize:15,fontWeight:200,color:"#e8e6e0",marginBottom:4}}>{r.name}</div>
                  <div style={{fontSize:11,color:"#888",marginBottom:12}}>{r.cuisine} · {r.time} min · {r.tag}</div>
                  <div style={{display:"flex",gap:8}}>
                    {[["loved","♥ loved"],["liked","✓ liked"],["skip","✕ skip"]].map(([rv,label])=>(
                      <div key={rv} className="p" onClick={()=>rate(r.id,rv)}
                        style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:50,fontSize:11,letterSpacing:.5,transition:"all .15s",
                          background:st.ratings[r.id]===rv?"#e8e6e0":"#1a1a1a",
                          color:st.ratings[r.id]===rv?"#000":"#999",border:"1px solid #2a2a2a"}}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,
        background:"rgba(0,0,0,.92)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderTop:"1px solid #111",padding:"14px 0 26px",display:"flex",zIndex:100}}>
        {TABS.map(t=>(
          <div key={t.id} className="p" onClick={()=>upd({tab:t.id})}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{fontSize:14,opacity:st.tab===t.id?1:.2,transition:"opacity .2s"}}>{t.icon}</div>
            <div style={{fontSize:9,letterSpacing:1.5,color:st.tab===t.id?"#e8e6e0":"#666",fontWeight:st.tab===t.id?500:400,transition:"color .2s"}}>{t.id}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
