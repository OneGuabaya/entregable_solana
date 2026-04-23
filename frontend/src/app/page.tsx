"use client";

import { useState, useEffect, useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import idl from "@/idl/backend.json";
import RegisterModal from "@/components/RegisterModal";
import * as web3 from "@solana/web3.js";

export default function Home() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const [mounted, setMounted] = useState(false);
    const [developers, setDevelopers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDev, setSelectedDev] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (mounted) {
            if (wallet) fetchDevelopers();
            else { setDevelopers([]); setLoading(false); }
        }
    }, [wallet, mounted]);

    const fetchDevelopers = async () => {
        if (!wallet) return;
        setLoading(true);
        // Usamos processed para obtener la versión más reciente del estado de la red
        const provider = new AnchorProvider(connection, wallet, { commitment: "processed" });
        const program = new Program(idl as Idl, provider);

        try {
            const accountClient = (program.account as any).developerProfile || (program.account as any).DeveloperProfile;
            const accounts = await accountClient.all();
            setDevelopers(accounts.map((acc: any) => ({
                ...acc.account,
                publicKey: acc.publicKey.toBase58(),
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProfile = async () => {
        if (!wallet) return;
        if (!confirm("¿Deseas eliminar tu perfil? Recuperarás el SOL del depósito.")) return;

        const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
        const program = new Program(idl as Idl, provider);

        try {
            const [devAccount] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from("developer"), wallet.publicKey.toBuffer()],
                program.programId
            );

            const deleteMethod = (program.methods as any).delete_developer || (program.methods as any).deleteDeveloper;

            await deleteMethod()
                .accounts({ dev_account: devAccount, user: wallet.publicKey })
                .rpc({ skipPreflight: true });

            alert("Perfil borrado. Sincronizando con Devnet...");

            setDevelopers(prev => prev.filter(d => d.owner.toBase58() !== wallet.publicKey.toBase58()));

            setTimeout(() => fetchDevelopers(), 3000);
        } catch (err) {
            console.error(err);
            alert("Hubo un problema de red. Refresca la página en unos segundos.");
        }
    };

    const filteredDevs = useMemo(() => {
        return developers.filter((dev) =>
            `${dev.name} ${dev.lastName} ${dev.techs}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [developers, searchTerm]);

    if (!mounted) return null;

    if (!wallet) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-transparent" suppressHydrationWarning>
                <div className="glass-card p-12 flex flex-col items-center border border-white/10 rounded-[40px] bg-slate-950/40 backdrop-blur-3xl shadow-2xl z-10">
                    <h1 className="text-4xl font-black text-white mb-8 italic tracking-tighter">SOLANA HUB</h1>
                    <WalletMultiButton />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-8 md:p-20 max-w-7xl mx-auto bg-transparent text-white relative z-10" suppressHydrationWarning>
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black italic tracking-tighter">EXPLORE <span className="text-indigo-500">DEVS</span></h1>
                <div className="flex gap-4">
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
                        + UNIRME
                    </button>
                    <WalletMultiButton />
                </div>
            </header>

            <input
                type="text"
                placeholder="Buscar talento..."
                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl px-6 py-4 mb-12 text-white outline-none focus:border-indigo-500/50 transition-all backdrop-blur-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? <p className="text-slate-400 italic">Sincronizando con la red...</p> : filteredDevs.map((dev, i) => (
                    <div key={i} className="glass-card p-8 rounded-[30px] border border-white/10 bg-slate-900/40 backdrop-blur-xl border-t-indigo-500/30 flex flex-col hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between mb-6">
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-indigo-400">{dev.name[0]}</div>
                            <span className="text-green-400 font-bold">${dev.hourlyRate.toString()} <small className="text-slate-500 text-[10px]">P/H</small></span>
                        </div>
                        <h2 className="text-xl font-bold mb-4">{dev.name} {dev.lastName}</h2>
                        <div className="flex flex-wrap gap-1.5 mb-8 flex-grow">
                            {dev.techs.split(",").map((t: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 text-[9px] font-bold text-slate-400 bg-white/5 border border-white/5 rounded italic uppercase">{t.trim()}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedDev(dev)} className="flex-1 py-3 bg-white/5 hover:bg-indigo-600 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest border border-white/10">Ver Perfil</button>
                            {dev.owner.toBase58() === wallet.publicKey.toBase58() && (
                                <button onClick={deleteProfile} className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <RegisterModal onClose={() => { setIsModalOpen(false); fetchDevelopers(); }} />}
        </main>
    );
}