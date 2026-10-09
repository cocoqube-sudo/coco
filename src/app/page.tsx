import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white bg-forest-deep py-14 md:py-24">
        {/* Background Decorative Rings */}
        <div className="absolute w-[42rem] h-[42rem] -right-40 -top-80 border border-leaf/30 rounded-full shadow-[0_0_0_5rem_rgba(0,167,200,.035),0_0_0_10rem_rgba(140,200,75,.025)] pointer-events-none"></div>
        
        <div className="relative px-5 max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-24 items-center">
          <div>
            <p className="text-label-caps text-[#b9e37f] mb-3">Coco peat supplier from India</p>
            <h1 className="text-display-lg max-w-[14ch] mb-4">
              Coco peat, grow bags and coir products for <span className="text-[#b9e37f]">global buyers.</span>
            </h1>
            <p className="text-lede text-[#cce0d5] max-w-[42rem] mb-8">
              CocoQube supplies low EC coco peat blocks, high EC coco peat, coco peat grow bags and finished coir products for importers, distributors, commercial growers, nurseries and wholesale buyers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] bg-leaf text-[#12331f] hover:bg-[#a5dc67] transition-colors"
                href="/products"
              >
                Explore coir products
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] text-white border border-white/30 hover:border-white transition-colors"
                href="/export-enquiry"
              >
                Request an export quote
              </Link>
            </div>
          </div>
          
          <div className="relative min-h-[23rem] md:min-h-[31rem] w-full max-w-lg mx-auto">
            <div className="absolute inset-4 md:inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-[0_28px_80px_rgba(6,57,35,0.14)] overflow-hidden">
              <div className="absolute inset-x-[11%] bottom-[8%] h-[2rem] rounded-full bg-black/30 blur-xl"></div>
              
              <div className="absolute z-10 top-6 left-6 p-3 rounded-2xl bg-forest-deep/80 border border-white/20 backdrop-blur-sm">
                <strong className="block text-[0.8rem] tracking-widest text-[#b9e37f] uppercase mb-1">Core export range</strong>
                <span className="text-white text-[0.9rem]">Low EC blocks · High EC blocks · Grow bags</span>
              </div>
              
              <Image 
                className="absolute w-[73%] -left-[8%] bottom-[12%] z-[3] drop-shadow-[0_22px_24px_rgba(0,0,0,0.28)] object-contain" 
                src="/assets/coco-grow-bag.png" 
                alt="Coco peat grow bag for greenhouse cultivation"
                width={500}
                height={500}
                priority
              />
              <Image 
                className="absolute w-[62%] -right-[2%] bottom-[7%] z-[2] drop-shadow-[0_20px_22px_rgba(0,0,0,0.25)] object-contain" 
                src="/assets/coco-peat-5kg-block.png" 
                alt="Compressed 5 kg coco peat block from India"
                width={400}
                height={400}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b border-line">
        <div className="px-5 max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-line last:border-0">
            <strong className="block text-forest mb-1">For commercial buyers</strong>
            <span className="text-muted text-[0.92rem]">Importers, distributors, nurseries and professional growers.</span>
          </div>
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-line last:border-0">
            <strong className="block text-forest mb-1">Specification-led</strong>
            <span className="text-muted text-[0.92rem]">Size, grade, processing and packaging agreed before supply.</span>
          </div>
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-line last:border-0">
            <strong className="block text-forest mb-1">One coordinated range</strong>
            <span className="text-muted text-[0.92rem]">Domestic wholesale and international export enquiries.</span>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="bg-white py-16 md:py-28">
        <div className="px-5 max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-28 items-start">
          <div>
            <p className="text-label-caps text-forest mb-3">B2B coir supply partner</p>
            <h2 className="text-headline-lg max-w-[17ch]">India-sourced coco growing media and finished coir products.</h2>
          </div>
          <div className="text-botanical text-[1.05rem] space-y-4">
            <p>
              CocoQube is an India-based <strong>coco peat and coir products supplier</strong> serving domestic wholesale and international export requirements. Our portfolio combines horticultural growing media with natural-fibre nursery, landscaping and retail products.
            </p>
            <p>
              We translate each enquiry into a product specification, coordinate suitable manufacturing partners, confirm packing and commercial requirements, and support dispatch. Buyers receive one commercial contact for <strong>coco peat blocks, grow bags, coir pots, liners, mulch mats, coco poles and propagation products</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Range Section */}
      <section className="bg-gradient-to-b from-cream to-[#eef7f0] py-16 md:py-28">
        <div className="px-5 max-w-[76rem] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10">
            <div>
              <p className="text-label-caps text-forest mb-3">Complete portfolio</p>
              <h2 className="text-headline-lg max-w-[17ch]">Everything buyers can source through CocoQube.</h2>
            </div>
            <p className="text-muted max-w-[38rem]">
              Select a family to review available sizes, construction choices, technical details and indicative HSN references.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link className="flex flex-col min-h-[25rem] bg-white border border-line rounded-[1.35rem] overflow-hidden card-hover" href="/products#coco-substrates">
              <div className="h-[17rem] bg-pale w-full overflow-hidden">
                <Image src="/assets/catalog/56-5kg-coco-peat-block.png" alt="Compressed coco peat" width={400} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <small className="text-aqua font-[800] uppercase tracking-widest text-[0.8rem]">Growing media</small>
                <strong className="text-forest-ink text-[1.2rem] leading-tight">Coco peat blocks & briquettes</strong>
                <em className="text-muted not-italic text-[0.88rem]">Low EC · High EC · 5 kg · 1 kg · 650 g</em>
              </div>
            </Link>
            
            <Link className="flex flex-col min-h-[25rem] bg-white border border-line rounded-[1.35rem] overflow-hidden card-hover" href="/products#grow-bags">
              <div className="h-[17rem] bg-pale w-full overflow-hidden">
                <Image src="/assets/catalog/55-coco-grow-bag.png" alt="Coco peat grow bag" width={400} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <small className="text-aqua font-[800] uppercase tracking-widest text-[0.8rem]">Protected cultivation</small>
                <strong className="text-forest-ink text-[1.2rem] leading-tight">Coco peat grow bags</strong>
                <em className="text-muted not-italic text-[0.88rem]">Custom blend, size, holes and sleeve</em>
              </div>
            </Link>
            
            <Link className="flex flex-col min-h-[22rem] bg-white border border-line rounded-[1.35rem] overflow-hidden card-hover" href="/products#coir-pots">
              <div className="h-[14rem] bg-pale w-full overflow-hidden">
                <Image src="/assets/catalog/03-3-inch-coir-pot.png" alt="Coir pot" width={400} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <small className="text-aqua font-[800] uppercase tracking-widest text-[0.8rem]">Nursery</small>
                <strong className="text-forest-ink text-[1.2rem] leading-tight">Coir pots & seedling cups</strong>
                <em className="text-muted not-italic text-[0.88rem]">2 inch to 12 × 12 inch + custom</em>
              </div>
            </Link>
            
            <Link className="flex flex-col min-h-[22rem] bg-white border border-line rounded-[1.35rem] overflow-hidden card-hover" href="/products#liners">
              <div className="h-[14rem] bg-pale w-full overflow-hidden">
                <Image src="/assets/catalog/18-12-inch-coir-liner.png" alt="Coir basket liner" width={400} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <small className="text-aqua font-[800] uppercase tracking-widest text-[0.8rem]">Planters</small>
                <strong className="text-forest-ink text-[1.2rem] leading-tight">Basket, wall & conical liners</strong>
                <em className="text-muted not-italic text-[0.88rem]">Standard sizes, holders and hanger sets</em>
              </div>
            </Link>
            
            <Link className="flex flex-col min-h-[22rem] bg-white border border-line rounded-[1.35rem] overflow-hidden card-hover" href="/products#mulch">
              <div className="h-[14rem] bg-pale w-full overflow-hidden">
                <Image src="/assets/catalog/44-12-inch-coir-mulch-mat.png" alt="Coir mulch mat" width={400} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <small className="text-aqua font-[800] uppercase tracking-widest text-[0.8rem]">Landscaping</small>
                <strong className="text-forest-ink text-[1.2rem] leading-tight">Mulch mats & coir rolls</strong>
                <em className="text-muted not-italic text-[0.88rem]">6–36 inch mats, rolls and grow mats</em>
              </div>
            </Link>
            
            <Link className="flex flex-col min-h-[22rem] bg-white border border-line rounded-[1.35rem] overflow-hidden card-hover" href="/products#support">
              <div className="h-[14rem] bg-pale w-full overflow-hidden">
                <Image src="/assets/catalog/37-3-foot-coco-pole.png" alt="Coco pole" width={400} height={300} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-1">
                <small className="text-aqua font-[800] uppercase tracking-widest text-[0.8rem]">Plant support</small>
                <strong className="text-forest-ink text-[1.2rem] leading-tight">Coco poles & propagation products</strong>
                <em className="text-muted not-italic text-[0.88rem]">1–6 ft poles, coins and trays</em>
              </div>
            </Link>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] bg-forest text-white hover:bg-forest-deep transition-colors" href="/products">
              Open all product specifications
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Product Band */}
      <section className="bg-forest-ink text-white py-16 md:py-28">
        <div className="px-5 max-w-[76rem] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10">
            <div>
              <p className="text-label-caps text-[#b9e37f] mb-3">Export focus</p>
              <h2 className="text-headline-lg max-w-[17ch]">Three products lead the conversation.</h2>
            </div>
            <p className="text-[#b9c9c0] max-w-[38rem]">
              Low EC coco peat, natural high EC coco peat and grow bags are presented first for large-volume horticulture enquiries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/20 border border-white/20">
            <article className="p-8 bg-forest-ink">
              <span className="inline-block mb-10 text-leaf font-[800] text-xl">01</span>
              <h3 className="text-headline-md mb-3">Low EC blocks</h3>
              <p className="text-[#b9c9c0]">Washed coco peat options with target EC and test method agreed for the buyer’s application.</p>
            </article>
            <article className="p-8 bg-forest-ink">
              <span className="inline-block mb-10 text-leaf font-[800] text-xl">02</span>
              <h3 className="text-headline-md mb-3">High EC blocks</h3>
              <p className="text-[#b9c9c0]">Natural or unwashed material for buyer-qualified soil conditioning, blending or downstream processing.</p>
            </article>
            <article className="p-8 bg-forest-ink">
              <span className="inline-block mb-10 text-leaf font-[800] text-xl">03</span>
              <h3 className="text-headline-md mb-3">Grow bags</h3>
              <p className="text-[#b9c9c0]">Crop-led substrate composition, expanded dimensions, sleeve construction and opening pattern.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-28 bg-white">
        <div className="px-5 max-w-[76rem] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10">
            <div>
              <p className="text-label-caps text-forest mb-3">How we work</p>
              <h2 className="text-headline-lg max-w-[17ch]">A clear route from requirement to dispatch.</h2>
            </div>
            <p className="text-muted max-w-[38rem]">
              CocoQube operates as a focused coir brand and supply partner, coordinating suitable production rather than claiming to be the factory.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <article className="p-6 border-t border-line">
              <div className="text-aqua font-[800] text-lg mb-8">01</div>
              <h3 className="text-headline-md text-forest-ink mb-2">Understand</h3>
              <p className="text-muted">Application, product, size, quantity, destination and timing.</p>
            </article>
            <article className="p-6 border-t border-line">
              <div className="text-aqua font-[800] text-lg mb-8">02</div>
              <h3 className="text-headline-md text-forest-ink mb-2">Specify</h3>
              <p className="text-muted">Grade, processing, construction, packing and testing expectations.</p>
            </article>
            <article className="p-6 border-t border-line">
              <div className="text-aqua font-[800] text-lg mb-8">03</div>
              <h3 className="text-headline-md text-forest-ink mb-2">Confirm</h3>
              <p className="text-muted">Feasibility, MOQ, sample route, price and commercial terms.</p>
            </article>
            <article className="p-6 border-t border-line">
              <div className="text-aqua font-[800] text-lg mb-8">04</div>
              <h3 className="text-headline-md text-forest-ink mb-2">Coordinate</h3>
              <p className="text-muted">Approved production, packing, documentation and dispatch.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <div className="px-5 max-w-[76rem] mx-auto mb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest to-[#0b4b32] p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-white">
          <div className="absolute -right-28 -bottom-36 w-[21rem] h-[21rem] border border-[#8cc84b]/30 rounded-full"></div>
          <div className="relative z-10">
            <p className="text-label-caps text-[#b9e37f] mb-3">Start with your requirement</p>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] max-w-[17ch] leading-[1.08] font-[600] tracking-[-0.035em] m-0">Choose wholesale or export.</h2>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3">
            <Link className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] bg-leaf text-[#12331f] hover:bg-[#a5dc67] transition-colors" href="/wholesale-enquiry">
              India wholesale
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 min-h-[3.2rem] px-5 py-3 rounded-full font-[750] text-white border border-white/30 hover:border-white transition-colors" href="/export-enquiry">
              International export
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
