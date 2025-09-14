import { Container } from '~/components/ui/Container'

const NineOne = () => {
    return ( 
        <Container className="mt-16 sm:mt-24">
            <div className="text-center">
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-amber-300 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,0,255,.35)]">
                        91
                    </span>
                </h1>
                <div className="mt-3 overflow-hidden">
                    <div className="whitespace-nowrap text-xs uppercase tracking-widest text-fuchsia-500/80 dark:text-fuchsia-400/80 marquee">
                        ✦ 91 ✦ 91 ✦ 91 ✦ 91✦ 91 ✦
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <div className="rounded-2xl p-[3px] bg-gradient-to-r from-fuchsia-500 via-amber-300 to-cyan-400 shadow-[0_10px_40px_-10px_rgba(255,0,255,.35)]">
                    <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border border-white/30 dark:border-zinc-800">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/30 dark:border-zinc-800 rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></span>
                            </div>
                            <span className="text-[11px] font-semibold tracking-widest text-zinc-700 dark:text-zinc-300">
                                91 MEDIA PLAYER v2.001
                            </span>
                            <span className="text-[11px] text-zinc-500">★</span>
                        </div>
                        <div className="p-2 sm:p-4">
                            <video
                                src="/assets/products/91.mp4"
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full rounded-xl ring-1 ring-zinc-900/10 dark:ring-zinc-700/40"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <ul className="inline-flex flex-wrap justify-center gap-2">
                    <li className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                        cyber
                    </li>
                    <li className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                        y2k
                    </li>
                    <li className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                        friend: 91
                    </li>
                    <li className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
                        ✨ sparkles
                    </li>
                </ul>
            </div>
        </Container>
     );
}
 
export default NineOne;