"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const products = [
  {group:'coco-substrates',groupTitle:'Coco substrates',id:'low-ec-blocks',name:'Low EC coco peat blocks',image:'/assets/catalog/56-5kg-coco-peat-block.png',summary:'Washed coco peat for controlled horticulture and professional growing-media programmes.',variants:['5 kg compressed block','1 kg compressed block','650 g briquette','Custom compressed format'],specs:[['Processing','Washed; buffered when specified'],['EC','Buyer target and test method required'],['Material','Coco pith / coir pith'],['Packing','Loose, palletized or buyer-specified export pack']],hsn:'53050040 – Coir pith (indicative Indian ITC-HS reference)',uses:'Greenhouses, nurseries, substrate blending, hydroponic and soil-less growing systems.',custom:'Compression ratio, weight, sieve profile, pH/EC target, buffering, packaging and private label.'},
  {group:'coco-substrates',groupTitle:'Coco substrates',id:'high-ec-blocks',name:'High EC coco peat blocks',image:'/assets/catalog/56-5kg-coco-peat-block.png',summary:'Natural or unwashed coco peat for buyer-qualified applications and downstream processing.',variants:['5 kg compressed block','1 kg compressed block','650 g briquette','Custom compressed format'],specs:[['Processing','Natural / unwashed'],['EC','Actual range confirmed by lot and method'],['Material','Coco pith / coir pith'],['Packing','As agreed for wholesale or export']],hsn:'53050040 – Coir pith (indicative Indian ITC-HS reference)',uses:'Soil conditioning, blending and applications where soluble salts can be managed.',custom:'Weight, density, screening, packaging and buyer label.'},
  {group:'coco-substrates',groupTitle:'Coco substrates',id:'husk-chip-blocks',name:'Coco husk chip blocks',image:'/assets/catalog/59-5kg-coco-husk-chip-block.png',summary:'Compressed coarse coconut husk chips used alone or blended to increase air space.',variants:['5 kg husk chip block','Chip-and-pith blend','Custom chip grade / block weight'],specs:[['Material','Cut coconut husk chips'],['Processing','Washed or buyer-specified'],['Structure','Chip size and dust level by requirement'],['Packing','Compressed block']],hsn:'53050090 – Other coconut / vegetable textile fibre material (indicative; confirm classification)',uses:'Orchid media, greenhouse substrates, drainage and aeration blends.',custom:'Chip size, pith percentage, EC method, block weight and packing.'},
  {group:'grow-bags',groupTitle:'Coco peat grow bags',id:'grow-bags',name:'Coco peat grow bags',image:'/assets/catalog/55-coco-grow-bag.png',summary:'Ready-to-expand substrate slabs coordinated for crop and protected-cultivation systems.',variants:['Standard slab format','Open-top / trough format','Crop-specific blend','Custom length × width × height'],specs:[['Fill','Pith, chips, fibre or agreed blend'],['Sleeve','UV-treated polyethylene when specified'],['Openings','Planting, dripper and drainage pattern'],['Testing','EC, pH, expansion and moisture by agreed method']],hsn:'53050040 – Coir pith; value-added forms include grow bags (indicative Indian ITC-HS reference)',uses:'Tomato, cucumber, capsicum, strawberry, flowers and other commercial crops.',custom:'Compressed and expanded dimensions, blend, weight, sleeve colour, holes, printing and pallet plan.'},
  {group:'coir-pots',groupTitle:'Coir pots & seedling products',id:'coir-pots',name:'Coir pots',image:'/assets/catalog/03-3-inch-coir-pot.png',summary:'Moulded natural coir pots for nursery propagation, transplanting and retail gardening.',variants:['3 inch','4 inch','5 inch','6 inch','6.5 inch XL','7 inch','8 inch','10 inch','5 × 5 inch Spanish pot','12 × 12 inch jumbo Spanish pot','Customized size'],specs:[['Material','Natural coir fibre with suitable binder'],['Shape','Round, square or buyer-approved profile'],['Use','Nursery and transplant applications'],['Packing','Nested bulk packing / retail packing']],hsn:'Indicative HSN family 4602 / 5609 – manufactured coir article; confirm by construction',uses:'Seed starting, nursery propagation, retail garden centres and transplant programmes.',custom:'Diameter, height, wall thickness, density, binder, branding and retail pack.'},
  {group:'coir-pots',groupTitle:'Coir pots & seedling products',id:'seedling-cups',name:'Seedling cups & Spanish cups',image:'/assets/catalog/01-2-inch-coir-seedling-cup.png',summary:'Small coir propagation cups for seedling production and nursery assortment programmes.',variants:['2 inch seedling cup','3 × 3 inch Spanish cup','Customized cavity / cup size'],specs:[['Material','Natural coir fibre'],['Format','Individual cup'],['Use','Germination and early propagation'],['Packing','Nested count-based cartons']],hsn:'Indicative HSN family 4602 / 5609 – manufactured coir article; confirm by construction',uses:'Vegetable seedlings, flowers, herbs and retail propagation kits.',custom:'Top diameter, base diameter, height, density and carton count.'},
  {group:'liners',groupTitle:'Planter liners',id:'basket-liners',name:'Round basket liners',image:'/assets/catalog/18-12-inch-coir-liner.png',summary:'Pre-shaped coir liners for hanging baskets and wire planters.',variants:['6 inch','8 inch','10 inch','12 inch','14 inch','16 inch','Each size available as liner or hanger set','Customized size'],specs:[['Material','Pressed natural coir fibre'],['Shape','Round basket profile'],['Options','Liner only or metal hanger set'],['Packing','Nested / set-based packing']],hsn:'Indicative HSN family 4602 / 5609 – coir liner or article; confirm with fittings',uses:'Hanging baskets, garden centres, landscaping and retail planter ranges.',custom:'Diameter, depth, wall thickness, holder finish, hanger length and retail pack.'},
  {group:'liners',groupTitle:'Planter liners',id:'conical-liners',name:'Conical liners & hangers',image:'/assets/catalog/24-5-inch-conical-liner.png',summary:'Tapered coir liners and holder options for decorative hanging arrangements.',variants:['5 inch conical liner','5 inch conical liner with holder','3-in-1 conical hanger','Customized profile'],specs:[['Material','Natural coir liner'],['Shape','Conical / tapered'],['Hardware','Holder or multi-hanger option'],['Packing','Nested liners / assembled sets']],hsn:'Indicative HSN family 4602 / 5609 – confirm based on coir and metal components',uses:'Decorative plants, balcony planters and garden retail.',custom:'Opening, height, taper, holder design, coating and hanger configuration.'},
  {group:'liners',groupTitle:'Planter liners',id:'wall-liners',name:'Wall liners & holders',image:'/assets/catalog/27-8-inch-wall-liner.png',summary:'Coir liners formed for wall-mounted semicircular planters.',variants:['8 inch wall liner','8 inch wall liner with holder','12 inch wall liner','12 inch wall liner with holder','Moon Bloom wall planter','Customized size'],specs:[['Material','Natural coir fibre liner'],['Profile','Wall / half-round'],['Options','Liner only or coated holder'],['Packing','Nested or assembled']],hsn:'Indicative HSN family 4602 / 5609 – confirm based on exact construction',uses:'Wall gardens, balconies, hospitality landscaping and garden retail.',custom:'Width, projection, depth, holder design, finish and label.'},
  {group:'mulch',groupTitle:'Mulch, rolls & grow mats',id:'mulch-mats',name:'Coir mulch mats',image:'/assets/catalog/44-12-inch-coir-mulch-mat.png',summary:'Circular coir mats that cover the growing surface around plants.',variants:['6 inch','8 inch','10 inch','12 inch','16 inch','20 inch','24 inch','30 inch','36 inch','Customized diameter or shape'],specs:[['Material','Needled natural coir fibre'],['Format','Disc with centre / slit as specified'],['Density','Buyer-approved GSM and thickness'],['Packing','Stacked, bundled or retail packed']],hsn:'Indicative HSN family 5609 / 5705 – coir article or mat; confirm by construction and use',uses:'Nursery containers, landscaping, weed suppression and moisture management.',custom:'Diameter, cut pattern, thickness, GSM, latex/binder choice and pack count.'},
  {group:'mulch',groupTitle:'Mulch, rolls & grow mats',id:'coir-rolls',name:'Coir needle felt rolls',image:'/assets/catalog/50-coir-needle-felt-roll.png',summary:'Needled coir fibre supplied in roll form for conversion and landscape applications.',variants:['Natural coir needle felt roll','Coir needle felt roll with PP support','Custom width × length'],specs:[['Material','Needled coir fibre'],['Backing','Natural or PP-supported option'],['Specification','Width, length, GSM and thickness'],['Packing','Rolled and wrapped']],hsn:'Indicative HSN family 5609 / 5705 – confirm based on backing and end use',uses:'Landscaping, planter conversion, erosion-management products and fabrication.',custom:'GSM, thickness, roll width, roll length, backing and perforation.'},
  {group:'mulch',groupTitle:'Mulch, rolls & grow mats',id:'grow-mats',name:'Coir grow mats & microgreen mats',image:'/assets/catalog/53-coir-grow-mat.png',summary:'Flat coir fibre growing surfaces for propagation and selected soil-less systems.',variants:['Coir microgreen mat','Coir grow mat','Custom sheet / roll size'],specs:[['Material','Natural coir fibre'],['Format','Cut sheet or roll'],['Specification','Size, thickness, density and moisture'],['Packing','Flat packed or rolled']],hsn:'Indicative HSN family 5609; classification may vary by construction',uses:'Microgreens, seed germination, propagation and custom growing systems.',custom:'Length, width, thickness, density, cuts and retail packaging.'},
  {group:'support',groupTitle:'Plant support & propagation',id:'coco-poles',name:'Coco poles',image:'/assets/catalog/37-3-foot-coco-pole.png',summary:'Coir-wrapped plant supports for climbers and vertical gardening.',variants:['1 foot','2 foot','3 foot','4 foot','5 foot','6 foot','Customized length / diameter'],specs:[['Core','Buyer-approved support core'],['Cover','Coir fibre wrap'],['Size','Length and diameter by order'],['Packing','Bundled / carton packed']],hsn:'Indicative HSN family 5609 – product of coir; confirm based on core material',uses:'Indoor plants, nurseries, garden centres and vertical plant support.',custom:'Length, diameter, core material, fibre density, top finish and label.'},
  {group:'support',groupTitle:'Plant support & propagation',id:'coco-coins',name:'Coco coins',image:'/assets/catalog/60-netted-coco-coins.png',summary:'Small compressed coco pith discs for seed starting and propagation.',variants:['Netted coco coin','Nude coco coin','Custom diameter / weight'],specs:[['Material','Compressed coco pith'],['Format','Netted or unnetted disc'],['Processing','EC and pH by agreed method'],['Packing','Bulk or count-based retail pack']],hsn:'53050040 – Coir pith (indicative Indian ITC-HS reference)',uses:'Seed germination, plugs, home growing kits and nursery propagation.',custom:'Diameter, expanded height, weight, net type, EC target and pack count.'},
  {group:'support',groupTitle:'Plant support & propagation',id:'coir-trays',name:'Coir trays & holders',image:'/assets/catalog/33-12x12-jumbo-spanish-pot.png',summary:'Coir propagation containers and compatible holder systems.',variants:['Single-cavity coir tray','Single-cavity tray holder','Custom tray configuration'],specs:[['Material','Coir fibre tray'],['Support','Holder available separately'],['Cavities','Standard or buyer-developed'],['Packing','Nested trays / coordinated sets']],hsn:'Indicative HSN family 4602 / 5609 – confirm based on tray construction and holder',uses:'Nursery propagation and commercial planting programmes.',custom:'Tray dimensions, cavity dimensions, holder, density and packing.'},
  {group:'utility',groupTitle:'Coir utility products',id:'scrub-pads',name:'Coir scrub pads',image:'/assets/catalog/54-coir-scrub-pad.png',summary:'Natural coir-fibre cleaning pads for wholesale, retail and private-label programmes.',variants:['Standard coir scrub pad','Custom shape / pack count'],specs:[['Material','Natural coir fibre'],['Format','Cut cleaning pad'],['Specification','Dimensions, thickness and density'],['Packing','Bulk or retail-labelled pack']],hsn:'Indicative HSN family 5609 – manufactured coir article; confirm by construction and destination classification',uses:'Household cleaning, kitchenware assortments and natural-product retail.',custom:'Length, width, thickness, density, stitching/binder and retail pack.'}
];

export default function Products() {
  const groups = Array.from(new Set(products.map(p => p.group)));
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  return (
    <main>
      {/* Page Hero */}
      <section className="bg-forest-deep text-white py-14 md:py-24">
        <div className="px-5 max-w-[76rem] mx-auto">
          <div className="flex gap-2 text-[#afc7ba] text-[0.9rem] mb-5">
            <Link href="/" className="text-white hover:underline">Home</Link>
            <span>/</span>
            <span>Products</span>
          </div>
          <p className="text-label-caps text-[#b9e37f] mb-3">Complete product catalogue</p>
          <h1 className="text-[clamp(2.8rem,6vw,5rem)] max-w-[15ch] leading-[1.08] tracking-[-0.035em] font-[600] mb-4">
            Select a product family. Open the details.
          </h1>
          <p className="text-lede text-[#cce0d5] max-w-[42rem]">
            Each family shows its standard variants, key specifications, application, packing considerations and indicative Indian HSN reference. Customized sizes are available subject to feasibility and MOQ.
          </p>
        </div>
      </section>

      {/* Category Jump */}
      <nav className="sticky top-[5rem] z-[35] bg-white/95 backdrop-blur-[12px] border-b border-line" aria-label="Product categories">
        <div className="px-5 max-w-[76rem] mx-auto flex gap-2 py-[0.7rem] overflow-x-auto whitespace-nowrap scrollbar-hide">
          <a href="#coco-substrates" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Coco substrates</a>
          <a href="#grow-bags" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Grow bags</a>
          <a href="#coir-pots" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Pots</a>
          <a href="#liners" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Liners</a>
          <a href="#mulch" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Mats & rolls</a>
          <a href="#support" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Poles & propagation</a>
          <a href="#utility" className="flex-none px-3 py-[0.45rem] rounded-full text-forest bg-pale text-[0.82rem] font-[750] hover:bg-forest/10 transition-colors">Utility</a>
        </div>
      </nav>

      {/* Catalogue Section */}
      <section className="bg-white pt-10 pb-20">
        <div className="px-5 max-w-[76rem] mx-auto">
          
          <div className="p-6 md:p-11 border border-line rounded-[1.25rem] bg-white mb-5">
            <h2 className="text-[clamp(1.55rem,2.5vw,2.25rem)] mb-4">Bulk coco peat and coir products from India</h2>
            <p className="text-botanical mb-4">
              CocoQube’s B2B catalogue covers <strong>low EC coco peat blocks, high EC coco peat blocks, coco peat grow bags, coco husk chip blocks and compressed coir pith products</strong> for professional horticulture. The finished-product range includes wholesale coir pots, seedling cups, basket liners, wall liners, mulch mats, needle-felt rolls, coco poles, coco coins, propagation trays and coir scrub pads.
            </p>
            <p className="text-botanical">
              Each quotation is developed around the buyer’s application, required dimensions, processing, quantity, packing and destination. Custom sizes and private-label packaging are evaluated subject to production feasibility and MOQ.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center p-4 px-5 mb-12 border-l-4 border-aqua bg-white shadow-[0_10px_30px_rgba(6,57,35,0.05)]">
            <strong className="text-forest-ink">How to use this catalogue</strong>
            <span className="text-muted">Click any product card to open a detailed specification panel. Values are commercial reference points; the accepted quotation and order specification control supply.</span>
          </div>

          <div className="space-y-16">
            {groups.map(group => {
              const groupProducts = products.filter(p => p.group === group);
              const groupTitle = groupProducts[0].groupTitle;
              
              return (
                <div key={group} id={group} className="scroll-mt-40">
                  <div className="mb-6">
                    <h2 className="text-[clamp(1.8rem,3vw,2.75rem)]">{groupTitle}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupProducts.map(product => (
                      <button 
                        key={product.id} 
                        onClick={() => setSelectedProduct(product)}
                        className="grid grid-cols-[8.5rem_1fr] min-h-[13rem] p-0 overflow-hidden text-left border border-line rounded-[1.15rem] bg-white cursor-pointer shadow-[0_10px_32px_rgba(6,57,35,0.055)] hover:-translate-y-1 hover:border-aqua transition-all group"
                      >
                        <div className="min-h-full bg-pale flex items-center justify-center">
                          <Image src={`https://cocoqube-global.febi044.chatgpt.site${product.image}`} alt={product.name} width={150} height={200} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-[0.42rem] p-4">
                          <small className="text-aqua font-[800] uppercase tracking-[0.07em] text-[0.75rem]">{product.groupTitle}</small>
                          <strong className="text-[1.05rem] leading-tight text-forest-ink">{product.name}</strong>
                          <em className="text-muted not-italic text-[0.82rem] leading-[1.45]">{product.summary}</em>
                          <span className="mt-auto text-forest text-[0.82rem] font-[750] group-hover:text-aqua transition-colors">View details →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </section>

      {/* CTA Band */}
      <div className="px-5 max-w-[76rem] mx-auto mb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest to-[#0b4b32] p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-white">
          <div className="absolute -right-28 -bottom-36 w-[21rem] h-[21rem] border border-[#8cc84b]/30 rounded-full"></div>
          <div className="relative z-10">
            <p className="text-label-caps text-[#b9e37f] mb-3">Need a non-standard size?</p>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] max-w-[17ch] leading-[1.08] font-[600] tracking-[-0.035em] m-0">Send a drawing, sample or specification.</h2>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3">
            <Link className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] bg-leaf text-[#12331f] hover:bg-[#a5dc67] transition-colors" href="/wholesale-enquiry">
              Wholesale enquiry
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] text-white border border-white/30 hover:border-white transition-colors" href="/export-enquiry">
              Export enquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Product Drawer */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${selectedProduct ? 'visible opacity-100' : 'invisible opacity-0'}`}
        aria-hidden={!selectedProduct}
      >
        <div 
          className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm cursor-pointer transition-opacity" 
          onClick={() => setSelectedProduct(null)}
          aria-label="Close product details"
        ></div>
        
        <article 
          className={`relative w-full max-w-[42rem] h-full bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${selectedProduct ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog" 
          aria-modal="true" 
        >
          <button 
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-pale text-forest hover:bg-forest hover:text-white transition-colors z-10 text-2xl font-light pb-1"
            onClick={() => setSelectedProduct(null)}
            aria-label="Close"
          >
            &times;
          </button>
          
          {selectedProduct && (
            <div className="p-8 md:p-12 pb-24 pt-16 md:pt-12">
              {/* Hero */}
              <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-pale rounded-[1.2rem] flex-shrink-0 flex items-center justify-center overflow-hidden self-start">
                  <Image src={`https://cocoqube-global.febi044.chatgpt.site${selectedProduct.image}`} alt={selectedProduct.name} width={200} height={200} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-label-caps text-forest mb-2">{selectedProduct.groupTitle}</p>
                  <h2 className="text-[2rem] font-[700] text-forest-ink leading-tight mb-3">{selectedProduct.name}</h2>
                  <p className="text-botanical text-[1.05rem] leading-[1.6]">{selectedProduct.summary}</p>
                </div>
              </div>

              {/* Variants */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-pale flex items-center justify-center text-forest">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h3 className="text-[1.3rem] font-[700] text-forest-ink m-0">Available variants</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.variants.map((v: string) => (
                    <span key={v} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-line shadow-sm hover:shadow-md hover:border-aqua/50 transition-all rounded-xl text-[0.9rem] font-[600] text-forest-ink">
                      <span className="w-2 h-2 rounded-full bg-aqua"></span>
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-pale flex items-center justify-center text-forest">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  </div>
                  <h3 className="text-[1.3rem] font-[700] text-forest-ink m-0">Specification framework</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProduct.specs.map(([label, value]: string[]) => (
                    <div key={label} className="p-4 rounded-[1.2rem] bg-[#f8faf9] border border-line/60 hover:border-forest/30 transition-colors">
                      <dt className="text-[0.75rem] uppercase tracking-wider font-[800] text-forest mb-1.5">{label}</dt>
                      <dd className="text-[0.95rem] text-forest-ink font-[600] leading-snug m-0">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>

              {/* HSN */}
              <div className="mb-12">
                <div className="relative overflow-hidden p-6 md:p-8 rounded-[1.5rem] bg-gradient-to-br from-forest-deep to-forest text-white shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-leaf">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                      </div>
                      <h3 className="text-[1.15rem] font-[700] m-0">HSN reference</h3>
                    </div>
                    <div>
                      <p className="text-[1.05rem] font-[600] text-[#e1f1e5] mb-3">{selectedProduct.hsn}</p>
                      <p className="text-[0.82rem] text-white/70 leading-relaxed max-w-[50ch]">
                        Classification is indicative. Confirm the final HSN with the customs or tax professional responsible for the exact product construction, fittings, packaging and transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uses */}
              <div className="mb-10">
                <h3 className="text-[1.3rem] font-[700] text-forest-ink mb-4 border-b border-line pb-3">Typical applications</h3>
                <p className="text-botanical leading-relaxed">{selectedProduct.uses}</p>
              </div>

              {/* Customization */}
              <div className="mb-12">
                <h3 className="text-[1.3rem] font-[700] text-forest-ink mb-4 border-b border-line pb-3">Customization</h3>
                <p className="text-botanical leading-relaxed">{selectedProduct.custom}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link href={`/export-enquiry?product=${encodeURIComponent(selectedProduct.name)}`} className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-6 rounded-full font-[750] text-white bg-forest hover:bg-forest-deep transition-colors text-[0.95rem]">
                  Export enquiry
                </Link>
                <Link href={`/wholesale-enquiry?product=${encodeURIComponent(selectedProduct.name)}`} className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-6 rounded-full font-[750] text-forest bg-transparent border-2 border-forest hover:bg-pale transition-colors text-[0.95rem]">
                  Wholesale enquiry
                </Link>
              </div>
            </div>
          )}
        </article>
      </div>

    </main>
  );
}
