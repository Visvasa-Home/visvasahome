// Centralized Services Data Generator
// Generates 2,160+ unique services and sub-services across 27 categories

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  warranty: string;
  popular: boolean;
  subcategory: string;
  category: string;
  slug: string;
  emoji: string;
  rating: number;
  reviews: number;
}

// Helper to generate 80 services per category
function generateServicesForCategory(
  categoryName: string,
  slug: string,
  emoji: string,
  subcategories: string[],
  baseServices: { name: string; desc: string; price: number }[]
): ServiceItem[] {
  const list: ServiceItem[] = [];
  const locs = ["Living Room", "Kitchen", "Master Bedroom", "Kids Room", "Guest Bathroom", "Balcony", "Terrace", "Main Lobby", "Office Space", "Outdoor Area"];
  const options = ["Standard", "Premium Service", "Express Dispatch", "Executive Care", "Value Bundle", "Eco-friendly", "Heavy Duty", "Advanced Fix", "Pro Treatment", "Deluxe Option"];

  for (let i = 0; i < baseServices.length; i++) {
    const base = baseServices[i];
    const subcat = subcategories[i % subcategories.length];
    for (let j = 0; j < 10; j++) {
      const loc = locs[j];
      const opt = options[(i + j) % options.length];
      const id = `${slug.replace('-services', '').replace('-repair', '')}_${i}_${j}`;
      list.push({
        id,
        name: `${base.name} - ${loc} (${opt})`,
        description: `${base.desc} Tailored for ${loc.toLowerCase()} layouts using ${opt.toLowerCase()} specifications and certified tools.`,
        price: base.price + (j * 30),
        duration: `${30 + (j * 5)} mins`,
        warranty: `${15 + (j % 3) * 15} days`,
        popular: (i + j) % 4 === 0,
        subcategory: subcat,
        category: categoryName,
        slug,
        emoji,
        rating: +(4.5 + ((i + j) % 5) * 0.1).toFixed(1),
        reviews: 50 + (i * 20) + (j * 15)
      });
    }
  }
  return list;
}

// Base configurations for all 27 categories
const categoryConfigs = [
  {
    name: 'Plumbing',
    slug: 'plumbing-services',
    emoji: '🚰',
    subcategories: ['Basic Plumbing Repairs', 'Tap & Faucet Installation/Repair', 'Pipe Fitting & Replacement', 'Geyser/Heater Installation & Service', 'Water Purifier (RO/UV) Installation & Service'],
    base: [
      { name: "Drain Unclogging", desc: "Clear blocked pipe and ensure smooth water drainage.", price: 199 },
      { name: "Tap & Faucet Repair", desc: "Fix dripping taps, replace spindle/cartridge or washer.", price: 149 },
      { name: "Pipe Joint Leak Fix", desc: "Seal leaking joint connections or replace cracked fittings.", price: 129 },
      { name: "Geyser Service & Install", desc: "Professional installation, descaling, and element check.", price: 399 },
      { name: "Water Purifier Service", desc: "Filter cartridge replacement, membrane cleanup, and TDS adjust.", price: 299 },
      { name: "Flush Tank Repair", desc: "Fix float valve, syphon mechanism or push button leak.", price: 199 },
      { name: "Shower Head Fitting", desc: "Install standard, overhead or telephone shower head.", price: 249 },
      { name: "Basin & Sink Install", desc: "Mount new ceramic washbasin or stainless steel sink.", price: 499 }
    ]
  },
  {
    name: 'Electrical',
    slug: 'electrical-services',
    emoji: '⚡',
    subcategories: ['Wiring & Rewiring', 'Fan Installation & Repair', 'Switchboard Upgradation', 'Smart Home Electrical Setup'],
    base: [
      { name: "Concealed wiring", desc: "Premium hidden wiring for devices and lights.", price: 349 },
      { name: "Switch board repair", desc: "Fix broken switches, sockets, and plug loops.", price: 199 },
      { name: "Ceiling fan install", desc: "Mount ceiling fan safely on hook with regulator config.", price: 199 },
      { name: "Exhaust fan repair", desc: "Install or repair ventilation exhaust fan.", price: 249 },
      { name: "Modular board fitting", desc: "Upgrade to modular multi-module switchboards.", price: 699 },
      { name: "MCB replacement", desc: "Replace faulty circuit breakers to prevent short circuits.", price: 249 },
      { name: "Smart switch setup", desc: "Configure smart switches with home Wi-Fi.", price: 999 },
      { name: "Dimmer installation", desc: "Fit rotating/slider speed dimmer switches.", price: 399 }
    ]
  },
  {
    name: 'AC & HVAC',
    slug: 'ac-services',
    emoji: '❄️',
    subcategories: ['AC Service & Cleaning', 'AC Installation', 'AC Gas Charging/Refill'],
    base: [
      { name: "Foam-jet AC service", desc: "Deep foam wash cleaning of AC filters, coils and tray.", price: 599 },
      { name: "Power-jet AC service", desc: "Pressure jet cleaning of split indoor/outdoor coils.", price: 799 },
      { name: "Split AC installation", desc: "Install indoor and outdoor split AC units safely.", price: 1499 },
      { name: "Window AC installation", desc: "Mount window AC inside frames with sealing.", price: 799 },
      { name: "AC gas refill R32", desc: "Recharge eco-friendly split AC refrigerant gas.", price: 799 },
      { name: "AC gas refill R410A", desc: "Refill R410A refrigerant gas in compressor.", price: 899 },
      { name: "Gas leak detection", desc: "Trace leaks in copper pipes using nitrogen pressure.", price: 299 },
      { name: "Coil cleaning", desc: "Clean corroded cooling coils using chemical sprays.", price: 349 }
    ]
  },
  {
    name: 'Painting',
    slug: 'painting-services',
    emoji: '🎨',
    subcategories: ['Interior Painting', 'Texture Painting', 'Waterproofing Solutions'],
    base: [
      { name: "Basic distemper painting", desc: "Apply budget-friendly distemper paint layers.", price: 5 },
      { name: "Standard emulsion painting", desc: "Apply premium washable plastic emulsion paints.", price: 7 },
      { name: "Premium emulsion", desc: "Luxury royal shine interior emulsion paint coats.", price: 10 },
      { name: "Metallic texture wall", desc: "Create luxury feature walls with sponge/spatula textures.", price: 45 },
      { name: "Ceiling painting", desc: "Apply white ceiling paint coats.", price: 6 },
      { name: "Door painting", desc: "Satin enamel coat painting for doors/windows.", price: 499 },
      { name: "Terrace waterproofing", desc: "Multi-layer waterproofing for open roofs.", price: 18 },
      { name: "Bathroom floor coating", desc: "Anti-seepage coating for floor tiles.", price: 25 }
    ]
  },
  {
    name: 'Carpentry & Wood',
    slug: 'carpentry-services',
    emoji: '🔨',
    subcategories: ['Furniture Assembly & Repair', 'Modular Kitchen Installation', 'False Ceiling Work'],
    base: [
      { name: "Flat-pack assembly", desc: "Assemble ready-to-use wardrobes, beds, tables.", price: 249 },
      { name: "Chair leg joint repair", desc: "Strengthen loose wooden chair joints and frames.", price: 199 },
      { name: "Hinge replacement", desc: "Replace rusted/loose hydraulic cabinet hinges.", price: 99 },
      { name: "Base cabinet fitting", desc: "Install modular kitchen bottom cabinet modules.", price: 599 },
      { name: "Counter top installation", desc: "Laying granite/quartz kitchen counters.", price: 349 },
      { name: "Kitchen sink fitting", desc: "Mount sink and connect drain plumbing.", price: 499 },
      { name: "Gypsum false ceiling", desc: "Erect gypsum board panels with frame support.", price: 65 },
      { name: "POP false ceiling", desc: "Designer plaster of Paris ceiling details.", price: 55 }
    ]
  },
  {
    name: 'Masonry & Tiling',
    slug: 'masonry-services',
    emoji: '🧱',
    subcategories: ['Tiling & Flooring Work', 'Plastering & Rendering'],
    base: [
      { name: "Ceramic floor tile labor", desc: "Lay basic ceramic tiles on sand-cement base.", price: 25 },
      { name: "Vitrified tile laying", desc: "Laying 2x2 or 4x2 premium vitrified tiles.", price: 35 },
      { name: "Wall tile fitting", desc: "Mount bathroom/kitchen backsplash glazed tiles.", price: 30 },
      { name: "Tile grouting labor", desc: "Seal tile gaps with epoxy or white cement grouts.", price: 10 },
      { name: "Cement plastering", desc: "Apply sand-cement plaster mix on brick walls.", price: 18 },
      { name: "Gypsum plastering", desc: "Smooth plastering over brickwork without primer.", price: 22 },
      { name: "Crack filling repairs", desc: "Fill wall cracks with premium elastomeric sealers.", price: 49 },
      { name: "Brick wall laying", desc: "Erect brick walls with mortar cement.", price: 35 }
    ]
  },
  {
    name: 'Excavation',
    slug: 'excavation-services',
    emoji: '🚜',
    subcategories: ['Foundation Excavation', 'Demolition Support'],
    base: [
      { name: "Trench excavation", desc: "Excavate soil trenches for utility pipelines.", price: 399 },
      { name: "Basement excavation", desc: "Deep mechanical excavation for building basements.", price: 499 },
      { name: "Manual rock breaking", desc: "Break hard rocks manual chiseling/hammering.", price: 999 },
      { name: "Machine rock breaking", desc: "Pneumatic breaker drilling on concrete or rock structures.", price: 1499 },
      { name: "Shoring & shuttering", desc: "Provide wooden/steel shuttering support.", price: 85 },
      { name: "Single wall demolition", desc: "Demolish interior partitions safely.", price: 2999 },
      { name: "Slab breaking work", desc: "Break concrete roof/floor slabs.", price: 45 },
      { name: "Tile breaking labor", desc: "Chisel out old floor tiles for refitting.", price: 15 }
    ]
  },
  {
    name: 'Roofing',
    slug: 'roofing-services',
    emoji: '🏠',
    subcategories: ['Roof Waterproofing', 'Insulation Work'],
    base: [
      { name: "Bituminous roof coating", desc: "Apply hot coal tar or bituminous coating layers.", price: 15 },
      { name: "APP membrane waterproofing", desc: "Torch-apply APP waterproofing membrane sheets.", price: 22 },
      { name: "Liquid membrane coating", desc: "Brush-apply elastomeric liquid membrane coat.", price: 28 },
      { name: "Crystalline waterproofing", desc: "Inject active crystals inside concrete slabs.", price: 35 },
      { name: "Thermal roof insulation", desc: "Install thermo-board insulation on ceilings.", price: 18 },
      { name: "Reflective foil lining", desc: "Install aluminum thermal heat reflector sheets.", price: 12 },
      { name: "Rock wool insulation", desc: "Lay thick rock wool batting over ceilings.", price: 25 },
      { name: "Acoustic roof insulation", desc: "Sound-dampening insulation panels on roofs.", price: 30 }
    ]
  },
  {
    name: 'General Handyman',
    slug: 'general-repair',
    emoji: '🔧',
    subcategories: ['General Handyman Services', 'Wall Hole Patching'],
    base: [
      { name: "Handyman 1 hour visit", desc: "Book handyman for general fittings and tasks.", price: 299 },
      { name: "Handyman half day support", desc: "Book handyman helper for 4 hours.", price: 899 },
      { name: "Picture shelf hanging", desc: "Mount shelves, photo frames, and mirrors.", price: 299 },
      { name: "Curtain rod fitting", desc: "Fit drapery curtain rods on wall brackets.", price: 149 },
      { name: "TV wall mounting", desc: "Drill and fix standard TV wall brackets.", price: 499 },
      { name: "Small wall hole patching", desc: "Patch drywall holes and apply wall putty.", price: 99 },
      { name: "Medium wall patch repair", desc: "Plaster and repaint medium-sized wall patches.", price: 199 },
      { name: "Crack sealing service", desc: "Fill wall joint gaps with silicone sealant.", price: 49 }
    ]
  },
  {
    name: 'Appliances',
    slug: 'appliance-repair',
    emoji: '🧊',
    subcategories: ['Refrigerator Repair & Service', 'Washing Machine Repair', 'TV & LED Repair'],
    base: [
      { name: "Fridge diagnostic check", desc: "Full inspection of thermostat and compressor.", price: 199 },
      { name: "Cooling gas refill", desc: "Vacuum and recharge refrigerator refrigerant gas.", price: 1999 },
      { name: "Compressor installation", desc: "Install new branded refrigerator compressor.", price: 3999 },
      { name: "Washing machine drum bearing", desc: "Replace noisy drum bearing wheels.", price: 2499 },
      { name: "WM drain pump change", desc: "Replace faulty water exit drain pump.", price: 899 },
      { name: "TV backlight repair", desc: "Replace burnt LED backlight strips.", price: 1499 },
      { name: "HDMI port replacement", desc: "Solder new HDMI input port onto sound board.", price: 499 },
      { name: "TV software reset", desc: "Firmware setup and OS tuning on smart TVs.", price: 299 }
    ]
  },
  {
    name: 'Pest Control',
    slug: 'pest-control',
    emoji: '🐜',
    subcategories: ['Cockroach Treatment', 'Termite Control'],
    base: [
      { name: "Gel bait cockroach control", desc: "Apply odorless cockroach gel inside cabinets.", price: 499 },
      { name: "Spray pest control", desc: "General insect pest spray around corners.", price: 599 },
      { name: "Kitchen cockroach gel", desc: "Targeted gel baiting in kitchen area only.", price: 349 },
      { name: "Termite pre-construction", desc: "Laying chemical barrier shield in soil base.", price: 8 },
      { name: "Termite injection repair", desc: "Drill-and-inject termiticide inside wood/walls.", price: 45 },
      { name: "Wood termite spray", desc: "Apply protective lacquer coating on furniture.", price: 25 },
      { name: "Bait station placement", desc: "Install monitoring bait stations in garden.", price: 999 },
      { name: "Ant control treatment", desc: "Targeted syrup baiting for red/black ants.", price: 399 }
    ]
  },
  {
    name: 'Home Cleaning',
    slug: 'cleaning-services',
    emoji: '🧹',
    subcategories: ['Deep Cleaning (Whole Home)', 'Sofa & Curtain Cleaning', 'Subscription Plans'],
    base: [
      { name: "Studio apartment deep clean", desc: "Thorough sanitization of studio flat rooms.", price: 1199 },
      { name: "1BHK full deep cleaning", desc: "Deep scrubbing of 1BHK rooms, kitchen & toilet.", price: 1799 },
      { name: "2BHK full deep cleaning", desc: "Deep cleaning for 2BHK flat surfaces and balcony.", price: 2499 },
      { name: "2-seater sofa extraction", desc: "Pressure foam shampoo extraction clean for sofas.", price: 599 },
      { name: "3-seater sofa shampooing", desc: "Full stain scrubbing and drying of 3-seater sofa.", price: 799 },
      { name: "Curtain panel dry clean", desc: "Dry clean vacuuming of hanging drapery panels.", price: 149 },
      { name: "Weekly regular clean plan", desc: "4 scheduled dusting and mopping visits/month.", price: 499 },
      { name: "Monthly deep clean visit", desc: "One complete monthly full deep cleaning visit.", price: 1499 }
    ]
  },
  {
    name: 'Interior Design',
    slug: 'interior-design',
    emoji: '📐',
    subcategories: ['Interior Design Packages', '3D Design & Visualization'],
    base: [
      { name: "Design consultation visit", desc: "Expert home layout design review and briefing.", price: 1999 },
      { name: "Single room design layout", desc: "Design plan with 2D drawings and layouts.", price: 24999 },
      { name: "1BHK turnkey execution", desc: "Full interior setup including execution & furniture.", price: 149999 },
      { name: "2BHK turnkey design plan", desc: "Complete 2BHK styling and furniture fitting.", price: 249999 },
      { name: "Single room 3D render", desc: "3D view of room layout matching selections.", price: 2999 },
      { name: "2BHK full 3D visual", desc: "Complete 3D visual package of all rooms.", price: 9999 },
      { name: "Virtual walkthrough tour", desc: "Walkthrough VR style representation of designs.", price: 4999 },
      { name: "Design revision feedback", desc: "Revision round of renders based on client choices.", price: 999 }
    ]
  },
  {
    name: 'Landscaping',
    slug: 'landscaping-services',
    emoji: '🌳',
    subcategories: ['Garden & Lawn Services'],
    base: [
      { name: "Lawn mowing service", desc: "Trim grass and weed margins of lawns.", price: 499 },
      { name: "Garden design layout", desc: "Planning layout, plants selection and soil setup.", price: 4999 },
      { name: "Artificial turf install", desc: "Laying synthetic green grass carpets.", price: 180 },
      { name: "Natural grass sod laying", desc: "Laying fresh Mexican grass carpets.", price: 35 },
      { name: "Tree pruning & trimming", desc: "Shape and prune branches of trees.", price: 499 },
      { name: "Drip irrigation setup", desc: "Install water pipe lines with micro-drippers.", price: 8999 },
      { name: "Sprinkler head install", desc: "Fit pop-up water lawn sprinkler valves.", price: 399 },
      { name: "Soil enrichment treatment", desc: "Apply organic manure and potting soil mix.", price: 599 }
    ]
  },
  {
    name: 'Flooring',
    slug: 'flooring-services',
    emoji: '🪵',
    subcategories: ['Tile & Marble Installation', 'Epoxy Flooring'],
    base: [
      { name: "Ceramic floor tiling", desc: "Install ceramic tiles on floor base.", price: 25 },
      { name: "Vitrified tile laying", desc: "Professional vitrified tile installation.", price: 35 },
      { name: "Italian marble laying", desc: "Laying premium Italian marble slabs.", price: 75 },
      { name: "Indian marble laying", desc: "Laying durable Indian marble slabs.", price: 45 },
      { name: "Granite flooring work", desc: "Fit granite tiles or steps with polishing.", price: 50 },
      { name: "Self-leveling epoxy", desc: "Pour smooth self-leveling epoxy resin coatings.", price: 85 },
      { name: "Metallic epoxy coat", desc: "Apply high-end metallic color design coatings.", price: 120 },
      { name: "Anti-static epoxy floor", desc: "Laying specialized anti-static protective flooring.", price: 110 }
    ]
  },
  {
    name: 'Salon & Beauty',
    slug: 'beauty-services',
    emoji: '✂️',
    subcategories: ['Facial Treatments', 'Waxing', 'Bridal Packages', 'Makeup'],
    base: [
      { name: "Basic cleanup facial", desc: "Remove blackheads and dirt from face skin.", price: 349 },
      { name: "Fruit facial glow", desc: "Gentle natural fruit cream skin rejuvenation.", price: 499 },
      { name: "Gold/pearl facial massage", desc: "Tan removal facial with gold/pearl dust cream.", price: 699 },
      { name: "Hydra facial clean", desc: "Modern deep water jet pore cleanup facial.", price: 1299 },
      { name: "Rica full arms wax", desc: "Apply soft Rica wax on arms.", price: 249 },
      { name: "Rica full legs wax", desc: "Apply Rica wax for smooth hair removal on legs.", price: 349 },
      { name: "Everyday natural makeup", desc: "Lightweight makeup base for daily styling.", price: 999 },
      { name: "Party makeup styling", desc: "HD base cosmetics makeup for special parties.", price: 1999 }
    ]
  },
  {
    name: 'Wellness & Fitness',
    slug: 'wellness-services',
    emoji: '💆',
    subcategories: ['Massage Therapy', 'Fitness Training', 'Physiotherapy Services'],
    base: [
      { name: "Swedish massage body rub", desc: "Relaxing muscle massage with oil to boost blood circulation.", price: 999 },
      { name: "Ayurvedic Abhyanga massage", desc: "Body massage using warm Ayurvedic herbal oil.", price: 1199 },
      { name: "Deep tissue massage relief", desc: "Chronic muscle relief massage using slow deep strokes.", price: 1299 },
      { name: "Single PT workout session", desc: "One-on-one personal trainer home session.", price: 699 },
      { name: "Monthly PT workout plan", desc: "Custom training program with trainer (8 visits).", price: 4999 },
      { name: "Physiotherapy consultation", desc: "Physiotherapist initial assessment and checkup.", price: 799 },
      { name: "Physio follow-up therapy", desc: "Exercise execution and muscle treatment session.", price: 599 },
      { name: "Sports rehab session", desc: "Muscle stretching and post-injury sports recovery.", price: 999 }
    ]
  },
  {
    name: 'Care & Support',
    slug: 'care-services',
    emoji: '👶',
    subcategories: ['Baby Care & Nanny Services', 'Elderly Care Assistance', 'Pet Grooming & Care'],
    base: [
      { name: "Day nanny 8-hour shift", desc: "Professional day child helper for routines.", price: 1199 },
      { name: "Night nanny 10-hour shift", desc: "Overnight child sleep guide and feed assistant.", price: 1499 },
      { name: "Newborn care specialist", desc: "Certified caregiver to log and treat newborn routines.", price: 1799 },
      { name: "Senior companion visit", desc: "Companion helper to chat, read and walk with seniors.", price: 499 },
      { name: "Elderly attendant 4h shift", desc: "Attendant for grooming, walks and dining support.", price: 999 },
      { name: "Dog bath & brush basic", desc: "Bath, blow dry and margins cleaning for dogs.", price: 499 },
      { name: "Dog full haircut groom", desc: "Professional scissor haircut and nail trim.", price: 999 },
      { name: "Cat grooming standard", desc: "Cat bath with grooming check and nails trim.", price: 699 }
    ]
  },
  {
    name: 'Events',
    slug: 'event-services',
    emoji: '🎉',
    subcategories: ['Wedding Setup & Decor', 'Party Planning', 'Event Equipment Rental'],
    base: [
      { name: "Basic mandap decoration", desc: "Floral canopy mandap setup.", price: 14999 },
      { name: "Premium mandap backdrop", desc: "Themed mandap decor with lights and drapes.", price: 29999 },
      { name: "Stage backdrop floral setup", desc: "Fit 10x8 ft floral backdrop panels.", price: 9999 },
      { name: "Kids birthday party setup", desc: "Themed balloon arch and table setup.", price: 3999 },
      { name: "Adult birthday party decor", desc: "Metallic chrome balloon background decor.", price: 5999 },
      { name: "Sound system basic rental", desc: "2 JBL speakers + 2 wireless mic rentals.", price: 4999 },
      { name: "Projector & screen rental", desc: "4K projector + tripod screen rental.", price: 1999 },
      { name: "Tent & shamiyana setup", desc: "Waterproof open field tent structure setup.", price: 1499 }
    ]
  },
  {
    name: 'Movers & Packers',
    slug: 'movers-packers',
    emoji: '📦',
    subcategories: ['Local Shifting', 'Intercity Moving', 'Packing Services'],
    base: [
      { name: "1RK local shifting pack", desc: "Load and shift 1RK flat items locally.", price: 2999 },
      { name: "1BHK local shifting pack", desc: "Packing and local shifting for 1BHK.", price: 4999 },
      { name: "2BHK local shifting pack", desc: "Complete packing, transport and loading for 2BHK.", price: 7999 },
      { name: "Intercity transport base", desc: "Transport vehicle for outstation shifting.", price: 9999 },
      { name: "Fragile item packing", desc: "Bubble wrap packing of glass and electronics.", price: 999 },
      { name: "Furniture dismantling", desc: "Dismantle wardrobes and beds for safe moving.", price: 499 },
      { name: "Loading & unloading labor", desc: "Skilled loader support for shifts.", price: 1499 },
      { name: "Unpacking & setup help", desc: "Arrange items at new home after shifting.", price: 1999 }
    ]
  },
  {
    name: 'Education & Tutors',
    slug: 'education-services',
    emoji: '📚',
    subcategories: ['Home Tutors', 'Music Classes', 'Hobby Classes'],
    base: [
      { name: "Math home tutor class", desc: "Personal math tutor for kids.", price: 499 },
      { name: "Science private tutor", desc: "Private science home tutor lessons.", price: 499 },
      { name: "English conversation drills", desc: "Spoken English home trainer guidance.", price: 399 },
      { name: "Guitar lessons at home", desc: "Learn guitar scales and tabs at home.", price: 599 },
      { name: "Keyboard/Piano home class", desc: "Home lessons for piano and keyboard playing.", price: 599 },
      { name: "Vocal singing training", desc: "Learn classic or pop singing styles.", price: 499 },
      { name: "Painting & sketching class", desc: "Learn watercolor painting and layout drawing.", price: 349 },
      { name: "Yoga & mindfulness classes", desc: "Breathing and posture training home tutor.", price: 499 }
    ]
  },
  {
    name: 'Pet Care & Boarding',
    slug: 'pet-care',
    emoji: '🐕',
    subcategories: ['Pet Boarding', 'Pet Walking', 'Vet Consultation'],
    base: [
      { name: "Daily pet walking session", desc: "Take dog for 30-min walking loop.", price: 199 },
      { name: "Weekly walking subscription", desc: "Daily dog walking visits for 7 days.", price: 1199 },
      { name: "Overnight pet boarding", desc: "Host pet at certified sitter home.", price: 499 },
      { name: "Day pet daycare boarding", desc: "8-hour daycare boarding for pets.", price: 299 },
      { name: "Vet general health check", desc: "Veterinary doctor general checkup at home.", price: 699 },
      { name: "Vet vaccinations at home", desc: "Administer vaccine shots to pets safely.", price: 899 },
      { name: "Pet behavior counseling", desc: "Training tips and behavioral guide by experts.", price: 999 },
      { name: "Pet tick & flea bath", desc: "Tick removal shampoo bath for pets.", price: 599 }
    ]
  },
  {
    name: 'Home Security',
    slug: 'home-security',
    emoji: '🛡️',
    subcategories: ['CCTV Installation', 'Smart Lock Installation', 'Alarm Systems'],
    base: [
      { name: "CCTV single camera install", desc: "Mount and route dome/bullet camera.", price: 499 },
      { name: "CCTV 4-camera network setup", desc: "Configure DVR/NVR and route 4 cameras.", price: 1999 },
      { name: "Smart door lock fitting", desc: "Install fingerprint smart biometric door lock.", price: 999 },
      { name: "Video doorbell install", desc: "Mount Wi-Fi camera doorbell on main entry.", price: 799 },
      { name: "Motion sensor alert setup", desc: "Install motion sensor alarms.", price: 599 },
      { name: "Intruder alarm configuration", desc: "Wire and test main alarm panels.", price: 1499 },
      { name: "Security audit inspection", desc: "Inspect lock margins and suggest upgrades.", price: 299 },
      { name: "CCTV repair & wire fix", desc: "Check connection errors or fix signal cables.", price: 399 }
    ]
  },
  {
    name: 'Purifier & Chimney',
    slug: 'water-purifier-chimney',
    emoji: '🥛',
    subcategories: ['Water Purifier Service', 'Kitchen Chimney Service'],
    base: [
      { name: "RO water purifier install", desc: "Mount RO water purifier cabinet.", price: 499 },
      { name: "RO standard filter service", desc: "Clean sedimentation filter and adjust TDS.", price: 599 },
      { name: "RO membrane replacement", desc: "Replace RO membrane filter core.", price: 799 },
      { name: "TDS checking & tuning", desc: "TDS check and taste tuning service.", price: 249 },
      { name: "Chimney regular cleanup", desc: "Dust off grease layers from filters.", price: 499 },
      { name: "Chimney deep grease clean", desc: "Deep caustic soda scrubbing of chimney parts.", price: 999 },
      { name: "Chimney exhaust pipe fit", desc: "Install or replace duct pipe lines.", price: 349 },
      { name: "Purifier leak repair", desc: "Check tube joints and replace leaking connector.", price: 299 }
    ]
  },
  {
    name: 'Home Improvement',
    slug: 'home-improvement',
    emoji: '✨',
    subcategories: ['Curtain Rods & Blinds', 'Wallpaper & Wall Decor', 'Grill & Fabrications'],
    base: [
      { name: "Curtain rod installation", desc: "Mount double/single curtain rods.", price: 149 },
      { name: "Venetian blinds mounting", desc: "Drill and fix rolling blinds brackets.", price: 249 },
      { name: "Wallpaper installation per roll", desc: "Apply designer wallpaper on wall surfaces.", price: 199 },
      { name: "Balcony safety net fitting", desc: "Fit nylon safety nets for kids/pets safety.", price: 799 },
      { name: "Window mosquito mesh setup", desc: "Fit velcro or magnetic mesh frames.", price: 499 },
      { name: "Iron window grill welding", desc: "Fabricate and weld protective window grills.", price: 1499 },
      { name: "Aluminium sliding window fix", desc: "Adjust track wheels of sliding frames.", price: 599 },
      { name: "Glass partition fitting", desc: "Install glass sheets for shower cubicles.", price: 2999 }
    ]
  },
  {
    name: 'Green Energy',
    slug: 'green-energy',
    emoji: '☀️',
    subcategories: ['Solar Panel Services', 'EV Charger Services'],
    base: [
      { name: "Solar panel inspection", desc: "Solar panel connection checks and voltage logs.", price: 499 },
      { name: "Solar panels washing clean", desc: "Wash dust and debris layers off panels.", price: 999 },
      { name: "Solar inverter diagnostic", desc: "Verify charge controller output stats.", price: 799 },
      { name: "EV home charger installation", desc: "Wall mount EV charger and connect power line.", price: 1999 },
      { name: "EV charging socket wiring", desc: "Laying heavy-duty 16A/32A EV wiring loop.", price: 999 },
      { name: "Solar battery fluid check", desc: "Refill distilled water inside batteries.", price: 299 },
      { name: "Net metering setup support", desc: "Support grid connections configuration.", price: 1499 },
      { name: "Solar wiring leakage test", desc: "Inspect grounding safety profiles.", price: 399 }
    ]
  },
  {
    name: 'Car Cleaning',
    slug: 'car-cleaning',
    emoji: '🚗',
    subcategories: ['Car Wash At Home', 'Car Detailing Subscriptions'],
    base: [
      { name: "Hatchback exterior wash", desc: "Shampoo wash and body drying of hatchback car.", price: 299 },
      { name: "Sedan exterior wash", desc: "Pressure wash and tire shining for sedan.", price: 349 },
      { name: "SUV deep cleaning wash", desc: "Wash and deep carpet vacuuming for SUV.", price: 499 },
      { name: "Car interior vacuum clean", desc: "Vacuum seats, dashboard and roof margins.", price: 399 },
      { name: "Car dashboard polishing", desc: "Apply dashboard shine coatings.", price: 199 },
      { name: "Car ceramic wax coating", desc: "Apply water-beading paint sealant wax.", price: 999 },
      { name: "Monthly weekly-wash plan", desc: "4 scheduled washing visits per month.", price: 1199 },
      { name: "Monthly biweekly-wash plan", desc: "2 scheduled washing visits per month.", price: 699 }
    ]
  }
];

// Generate the full database (2,160 items)
const initialServicesList: ServiceItem[] = categoryConfigs.flatMap(config =>
  generateServicesForCategory(config.name, config.slug, config.emoji, config.subcategories, config.base)
);

// Load from LocalStorage if available, otherwise write defaults
function loadServicesFromStorage(): ServiceItem[] {
  if (typeof window === 'undefined') return initialServicesList;
  try {
    const stored = localStorage.getItem('visvasahome_catalog_services');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading catalog services from storage:', e);
  }
  
  // Save defaults initially
  try {
    localStorage.setItem('visvasahome_catalog_services', JSON.stringify(initialServicesList));
  } catch (e) {}
  return initialServicesList;
}

export let allServices: ServiceItem[] = loadServicesFromStorage();

// Export helper to save back to storage (e.g. when admin changes it)
export function saveServicesToStorage(newList: ServiceItem[]) {
  allServices = newList;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('visvasahome_catalog_services', JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving catalog services to storage:', e);
    }
  }
}

// Fetch services by category page slug
export function getServicesBySlug(slug: string): ServiceItem[] {
  return allServices.filter(service => service.slug === slug);
}

// Search utility
export function searchServices(
  query: string,
  category: string,
  popularOnly: boolean,
  sortBy: string
): ServiceItem[] {
  let list = allServices;

  if (category && category !== 'All') {
    list = list.filter(s => s.category === category);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.subcategory.toLowerCase().includes(q)
    );
  }

  if (popularOnly) {
    list = list.filter(s => s.popular);
  }

  // Sorting
  if (sortBy === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    list = [...list].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    list = [...list].sort((a, b) => b.reviews - a.reviews);
  }

  return list;
}
