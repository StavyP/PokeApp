import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, X, Menu, Search, Trash2, RefreshCw, Sparkles, Trophy, Star, LogIn, UserPlus, LogOut, Table, Edit3
} from 'lucide-react';

// --- CONFIGURATION ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKVD4y_V54Xu6Esenyj-bIJyri1C88QOu69hGHJV-dR4jh0uyRfKEN4Qo6nRYkmEz2jQ/exec"; // <--- METS TON URL ICI

const GEN_RANGES = [
  { id: 1, name: "Gén 1", total: 151, start: 1, end: 151 },
  { id: 2, name: "Gén 2", total: 100, start: 152, end: 251 },
  { id: 3, name: "Gén 3", total: 135, start: 252, end: 386 },
  { id: 4, name: "Gén 4", total: 107, start: 387, end: 493 },
  { id: 5, name: "Gén 5", total: 156, start: 494, end: 649 },
  { id: 6, name: "Gén 6", total: 72, start: 650, end: 721 },
  { id: 7, name: "Gén 7", total: 88, start: 722, end: 809 },
  { id: 8, name: "Gén 8", total: 96, start: 810, end: 905 },
  { id: 9, name: "Gén 9", total: 120, start: 906, end: 1025 },
];

const POKE_TYPES = [
  { name: 'normal', color: 'bg-stone-400', fr: 'Normal' }, { name: 'fire', color: 'bg-orange-500', fr: 'Feu' },
  { name: 'water', color: 'bg-blue-500', fr: 'Eau' }, { name: 'grass', color: 'bg-emerald-500', fr: 'Plante' },
  { name: 'electric', color: 'bg-yellow-400', fr: 'Électrik' }, { name: 'ice', color: 'bg-cyan-400', fr: 'Glace' },
  { name: 'fighting', color: 'bg-red-700', fr: 'Combat' }, { name: 'poison', color: 'bg-purple-500', fr: 'Poison' },
  { name: 'ground', color: 'bg-amber-600', fr: 'Sol' }, { name: 'flying', color: 'bg-indigo-300', fr: 'Vol' },
  { name: 'psychic', color: 'bg-pink-500', fr: 'Psy' }, { name: 'bug', color: 'bg-lime-500', fr: 'Insecte' },
  { name: 'rock', color: 'bg-yellow-700', fr: 'Roche' }, { name: 'ghost', color: 'bg-violet-700', fr: 'Spectre' },
  { name: 'dragon', color: 'bg-indigo-600', fr: 'Dragon' }, { name: 'dark', color: 'bg-stone-700', fr: 'Ténèbres' },
  { name: 'steel', color: 'bg-slate-400', fr: 'Acier' }, { name: 'fairy', color: 'bg-pink-300', fr: 'Fée' }
];

const EXCLUDED_FORM_KEYWORDS = ['totem', 'cap', 'rock-star', 'belle', 'pop-star', 'phd', 'libre', 'starter', 'cosplay'];

// --- SOUND EFFECTS ---
const playSound = (type) => {
 
};

// --- COMPOSANTS AUXILIAIRES (TES COMPOSANTS V15) ---

const EvolutionNode = ({ node }) => (
  <div className="flex flex-col items-center gap-2 md:gap-4">
    <div className="bg-white/5 p-2 md:p-4 rounded-2xl md:rounded-3xl border border-white/10 flex flex-col items-center min-w-[80px] md:min-w-[110px] hover:bg-white/10 transition-all">
      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${node.id}.png`} alt={node.name} className="w-12 h-12 md:w-16 md:h-16" />
      <p className="text-[9px] md:text-[10px] font-black uppercase text-white mt-1 text-center">{node.name}</p>
      <p className="text-[7px] md:text-[8px] font-bold text-blue-400 uppercase italic">{node.method}</p>
    </div>
    {node.evolvesTo?.length > 0 && (
      <div className="flex flex-col items-center w-full">
        <div className="h-4 md:h-6 w-0.5 bg-gradient-to-b from-slate-700 to-transparent my-1 md:my-2"></div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {node.evolvesTo.map((child, i) => <EvolutionNode key={i} node={child} />)}
        </div>
      </div>
    )}
  </div>
);

const InfoViewer = ({ pokemonId, pokemonName, onClose }) => {
  const [data, setData] = useState(null);
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(r => r.json());
        const s = await fetch(p.species.url).then(r => r.json());
        const e = await fetch(s.evolution_chain.url).then(r => r.json());
        const build = (c) => ({
          name: c.species.name,
          id: c.species.url.split('/').filter(Boolean).pop(),
          method: c.evolution_details[0] ? "Évolution" : "Base",
          evolvesTo: c.evolves_to?.map(build) || []
        });
        setTree(build(e.chain));
        setData(p);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [pokemonId]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 w-full max-w-2xl rounded-3xl md:rounded-[3rem] max-h-[90vh] overflow-y-auto p-4 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="space-y-6 md:space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">{pokemonName}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <X className="text-white" size={20}/>
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              {data?.stats?.map(s => (
                <div key={s.stat.name} className="group">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-1">
                    <span>{s.stat.name}</span>
                    <span className="text-blue-400">{s.base_stat}</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out group-hover:from-cyan-400 group-hover:to-blue-500" style={{width: `${(s.base_stat/200)*100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col items-center">
              <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase mb-4 md:mb-8 flex items-center gap-2">
                <Star size={12} className="text-yellow-500" />
                Lignée d'évolution
              </h3>
              {tree && <EvolutionNode node={tree} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SpriteViewer = ({ pokemonId, pokemonName, onClose, isShinyMode }) => {
  const [spritesData, setSpritesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewBack, setViewBack] = useState(false);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(res => res.json())
      .then(data => { setSpritesData(data.sprites.versions); setLoading(false); })
      .catch(() => setLoading(false));
  }, [pokemonId]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white/10 w-full max-w-5xl max-h-[85vh] rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="p-3 md:p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
          <button onClick={() => { setViewBack(!viewBack); playSound('click'); }} className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black hover:shadow-lg hover:scale-105 transition-all">
            VUE : {viewBack ? "DOS" : "FACE"}
          </button>
          <h2 className="text-white font-black uppercase text-base md:text-xl tracking-wider">{pokemonName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90 duration-300">
            <X className="text-white" size={20} />
          </button>
        </div>
        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" size={40}/>
            </div>
          ) : spritesData && Object.keys(spritesData).map(gen => Object.keys(spritesData[gen]).map(game => {
            const key = viewBack ? (isShinyMode ? 'back_shiny' : 'back_default') : (isShinyMode ? 'front_shiny' : 'front_default');
            const url = spritesData[gen][game][key];
            return url && (
              <div key={game} className="bg-white/5 p-2 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center hover:bg-white/10 transition-all hover:scale-105 cursor-pointer group">
                <img src={url} alt={game} className="w-12 h-12 md:w-16 md:h-16 image-pixelated group-hover:scale-110 transition-transform" />
                <p className="text-[7px] md:text-[8px] text-blue-400 mt-1 md:mt-2 uppercase font-black text-center">{game.replace('-', ' ')}</p>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};

const AnimatedPokemonImage = ({ ownedFormIds, isShiny, defaultId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (ownedFormIds.length <= 1) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ownedFormIds.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [ownedFormIds]);

  const displayId = ownedFormIds.length > 0 ? ownedFormIds[currentIndex] : defaultId;
  const baseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`;
  
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center mb-4 md:mb-6">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${isShiny ? 'from-yellow-400/20 to-amber-600/20 animate-pulse' : 'from-blue-400/10 to-purple-400/10'} blur-xl`}></div>
      <img 
        key={displayId}
        src={`${baseUrl}${isShiny ? 'shiny/' : ''}${displayId}.png`} 
        className={`relative w-full h-full object-contain transition-all duration-500 ${isAnimating ? 'scale-75 opacity-0 rotate-12' : 'scale-100 opacity-100 rotate-0'} hover:scale-110`}
        alt="pokemon" 
      />
      {ownedFormIds.length > 1 && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {ownedFormIds.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-4' : 'bg-slate-400'}`}></div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- NOUVEAUX COMPOSANTS POUR LA PERSISTANCE (SANS TOUCHER AU DESIGN) ---

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const resp = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: isLogin ? 'login' : 'signup', username: user, password: pass })});
    const data = await resp.json();
    if (data.success) onAuthSuccess(user, data.userData || { normal: {}, shiny: {} });
    else alert("Erreur d'authentification");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-900 p-10 rounded-[3rem] w-full max-w-md border border-white/10 text-center">
        <h2 className="text-2xl font-black text-white italic mb-8 uppercase">Living Dex Cloud</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="text" placeholder="UTILISATEUR" value={user} onChange={e => setUser(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl text-white outline-none focus:ring-2 ring-blue-500" required />
          <input type="password" placeholder="MOT DE PASSE" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-slate-800 p-4 rounded-2xl text-white outline-none focus:ring-2 ring-blue-500" required />
          <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase">{isLogin ? "Se connecter" : "S'inscrire"}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="mt-8 text-slate-500 text-[10px] font-black uppercase">{isLogin ? "Créer un compte" : "J'ai un compte"}</button>
      </div>
    </div>
  );
};

const ShinyDetailModal = ({ pokemonName, currentData, onSave, onClose }) => {
  const [details, setDetails] = useState(currentData || { nickname: '', method: '', game: '' });
  return (
    <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-yellow-500/30 p-8 rounded-[2rem] w-full max-w-md">
        <div className="flex justify-between items-center mb-6"><h3 className="text-yellow-400 font-black italic uppercase">MODIFIER SHINY : {pokemonName}</h3><X className="text-white cursor-pointer" onClick={onClose} /></div>
        <div className="space-y-4">
          <input value={details.nickname} onChange={e => setDetails({...details, nickname: e.target.value})} className="w-full bg-white/5 p-4 rounded-xl text-white outline-none" placeholder="Surnom" />
          <input value={details.method} onChange={e => setDetails({...details, method: e.target.value})} className="w-full bg-white/5 p-4 rounded-xl text-white outline-none" placeholder="Méthode de Shasse" />
          <input value={details.game} onChange={e => setDetails({...details, game: e.target.value})} className="w-full bg-white/5 p-4 rounded-xl text-white outline-none" placeholder="Jeu de capture" />
          <button onClick={() => onSave(details)} className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPALE ---
const App = () => {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('pokedex_user'));
  const [activeGenId, setActiveGenId] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShinyMode, setIsShinyMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filterExclude, setFilterExclude] = useState(false);
  const [filterMissing, setFilterMissing] = useState(false);
  const [selectedSpritePoke, setSelectedSpritePoke] = useState(null);
  const [selectedInfoPoke, setSelectedInfoPoke] = useState(null);
  const [selectedShinyForm, setSelectedShinyForm] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const [collection, setCollection] = useState({ normal: {}, shiny: {} });

  const modeKey = isShinyMode ? 'shiny' : 'normal';

  // Chargement Cloud
  const handleAuthSuccess = (username, data) => {
    setCurrentUser(username);
    setCollection(data);
    localStorage.setItem('pokedex_user', username);
  };

  const saveToCloud = (updatedCol) => {
    if (!currentUser) return;
    fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'save', username: currentUser, userData: updatedCol })});
  };

  // Logique de capture V15 + Persistance
  const toggleForm = (pId, fId) => {
    setCollection(prev => {
      const currentEntry = prev[modeKey][pId]?.forms || {};
      const isCurrentlyOwned = currentEntry[fId];
      playSound(isCurrentlyOwned ? 'release' : 'catch');
      const newState = {
        ...prev,
        [modeKey]: { ...prev[modeKey], [pId]: { ...prev[modeKey][pId], forms: { ...currentEntry, [fId]: !isCurrentlyOwned } } }
      };
      // Sauvegarde Cloud automatique
      saveToCloud(newState);
      if (isShinyMode && !isCurrentlyOwned) {
        setSelectedShinyForm({ pId, fId, name: pokemonList.find(p => p.id === pId)?.name });
      }
      return newState;
    });
  };

  const saveShinyDetails = (details) => {
    setCollection(prev => {
      const newCol = { ...prev };
      if (!newCol.shiny[selectedShinyForm.pId].details) newCol.shiny[selectedShinyForm.pId].details = {};
      newCol.shiny[selectedShinyForm.pId].details[selectedShinyForm.fId] = details;
      saveToCloud(newCol);
      return newCol;
    });
    setSelectedShinyForm(null);
  };

  // --- TON FETCH V15 (INCHANGÉ) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let speciesResults = [];
        if (activeGenId === 0) {
          const d = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=1025`).then(r => r.json());
          speciesResults = d.results;
        } else {
          const d = await fetch(`https://pokeapi.co/api/v2/generation/${activeGenId}`).then(r => r.json());
          speciesResults = d.pokemon_species;
        }
        const detailed = await Promise.all(speciesResults.map(async (s) => {
          try {
            const sData = await fetch(s.url).then(r => r.json());
            const defaultId = sData.varieties.find(v => v.is_default).pokemon.url.split('/').filter(Boolean).pop();
            const pData = await fetch(`https://pokeapi.co/api/v2/pokemon/${defaultId}`).then(r => r.json());
            const filteredForms = sData.varieties
              .filter(v => {
                const name = v.pokemon.name.toLowerCase();
                return !name.includes('-mega') && !name.includes('-gmax') && !EXCLUDED_FORM_KEYWORDS.some(keyword => name.includes(keyword));
              })
              .map(v => ({ name: v.pokemon.name, id: v.pokemon.url.split('/').filter(Boolean).pop() }));
            return { id: sData.id, name: sData.names?.find(n => n.language.name === 'fr')?.name || sData.name, types: pData.types?.map(t => t.type.name) || [], forms: filteredForms };
          } catch { return null; }
        }));
        setPokemonList(detailed.filter(x => x !== null).sort((a, b) => a.id - b.id));
      } finally { setLoading(false); }
    };
    fetchData();
  }, [activeGenId]);

  const getStats = (idList) => {
    const caught = idList.filter(id => {
      const entry = collection[modeKey][id];
      return entry?.forms && Object.values(entry.forms).some(v => v === true);
    }).length;
    return { caught, total: idList.length, isComplete: caught === idList.length };
  };

  const displayedPokemon = useMemo(() => {
    return pokemonList.filter(p => {
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedTypes.length > 0) {
        const hasMatch = selectedTypes.some(t => p.types.includes(t));
        if (filterExclude && hasMatch) return false;
        if (!filterExclude && !hasMatch) return false;
      }
      const entry = collection[modeKey][p.id];
      const isCompleted = entry?.forms && Object.values(entry.forms).some(v => v === true);
      if (filterMissing && isCompleted) return false;
      return true;
    });
  }, [pokemonList, searchTerm, selectedTypes, filterExclude, filterMissing, collection, modeKey]);

  const overallStats = useMemo(() => {
    const total = 1025;
    const caught = Array.from({length: total}, (_, i) => i + 1).filter(id => {
      const entry = collection[modeKey][id];
      return entry?.forms && Object.values(entry.forms).some(v => v === true);
    }).length;
    return { caught, total, percentage: ((caught / total) * 100).toFixed(1) };
  }, [collection, modeKey]);

  const shinyStatsData = useMemo(() => {
    const list = [];
    Object.keys(collection.shiny || {}).forEach(pId => {
      const pInfo = pokemonList.find(p => p.id == pId);
      const forms = collection.shiny[pId].forms || {};
      Object.keys(forms).forEach(fId => {
        if (forms[fId]) {
          const details = collection.shiny[pId].details?.[fId] || {};
          list.push({ id: pId, name: pInfo?.name || '?', ...details });
        }
      });
    });
    return list;
  }, [collection, pokemonList]);

  if (!currentUser) return <AuthScreen onAuthSuccess={handleAuthSuccess} />;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${isShinyMode ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900'}`}>
      
      {/* SIDEBAR V15 (INCHANGÉE) */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-200" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={`fixed lg:sticky top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 z-[150] transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isSidebarOpen ? 'w-80' : 'w-0 lg:w-80'} border-r border-white/5 shadow-2xl overflow-hidden`}>
        <div className="w-80 p-8 flex flex-col h-full text-white">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black italic bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">LIVING-DEX</h2>
              <p className="text-[10px] text-slate-400 font-bold mt-1">{overallStats.caught}/{overallStats.total} • {overallStats.percentage}%</p>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setShowStats(!showStats)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Table size={16}/></button>
               <button onClick={() => {localStorage.clear(); window.location.reload();}} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><LogOut size={16}/></button>
            </div>
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative"><Search size={14} className="absolute left-3 top-3.5 text-slate-500" /><input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-800 p-3 pl-10 rounded-xl text-sm outline-none border-2 border-transparent focus:border-blue-500 transition-all placeholder:text-slate-500" placeholder="Rechercher..." /></div>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Types</span><button onClick={() => { setFilterExclude(!filterExclude); playSound('click'); }} className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${filterExclude ? 'bg-red-500' : 'bg-emerald-500'}`}>{filterExclude ? 'EXCLURE' : 'INCLURE'}</button></div>
              <div className="grid grid-cols-3 gap-2">{POKE_TYPES.map(t => (<button key={t.name} onClick={() => { setSelectedTypes(prev => prev.includes(t.name) ? prev.filter(x => x !== t.name) : [...prev, t.name]); playSound('click'); }} className={`py-2 rounded-lg text-[8px] font-black uppercase border-2 transition-all ${selectedTypes.includes(t.name) ? 'bg-white text-black border-white shadow-lg' : 'bg-slate-800 border-transparent text-slate-500 hover:bg-slate-700'}`}>{t.fr}</button>))}</div>
            </div>
            <button onClick={() => { setFilterMissing(!filterMissing); playSound('click'); }} className={`w-full py-4 rounded-xl font-black text-xs uppercase transition-all shadow-md ${filterMissing ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/20' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>{filterMissing ? "Voir Tout" : "Manquants uniquement"}</button>
            <button onClick={() => { setSearchTerm(""); setSelectedTypes([]); setFilterExclude(false); setFilterMissing(false); playSound('click'); }} className="w-full py-3 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all"><RefreshCw size={12} /> Reset Filtres</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className={`sticky top-0 z-[100] p-4 flex flex-col md:flex-row items-center gap-4 ${isShinyMode ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur-xl border-b shadow-lg`}>
          <button onClick={() => { setIsSidebarOpen(!isSidebarOpen); playSound('click'); }} className="p-3 bg-slate-900 text-white rounded-xl lg:hidden"><Menu size={20}/></button>
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button onClick={() => { setActiveGenId(0); playSound('click'); }} className={`flex-shrink-0 px-6 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${activeGenId === 0 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent' : 'bg-slate-100 text-slate-400 border-transparent hover:bg-slate-200'}`}>TOUT</button>
            {GEN_RANGES.map(gen => {
              const stats = getStats(Array.from({length: gen.end - gen.start + 1}, (_, i) => gen.start + i));
              return (
                <button key={gen.id} onClick={() => { setActiveGenId(gen.id); playSound('click'); }} className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all min-w-[100px] overflow-hidden ${activeGenId === gen.id ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-transparent shadow-red-500/50' : 'bg-slate-100 text-slate-400 border-transparent hover:bg-slate-200'}`}>
                  {stats.isComplete && <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse opacity-20"></div>}
                  <span className="relative z-10 flex items-center justify-center gap-1">{gen.name}{stats.isComplete && <Trophy size={10} className="text-yellow-300 animate-bounce" />}</span>
                  <span className="text-[8px] opacity-70 relative z-10">{stats.caught}/{gen.total}</span>
                </button>
              );
            })}
          </div>
          <button onClick={() => { setIsShinyMode(!isShinyMode); playSound(isShinyMode ? 'release' : 'catch'); }} className={`px-6 py-3 rounded-2xl font-black text-[10px] transition-all shadow-lg ${isShinyMode ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black scale-105 animate-pulse' : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white'}`}>{isShinyMode ? <span className="flex items-center gap-2"><Sparkles size={14} className="animate-spin" /> SHINY</span> : '📋 NORMAL'}</button>
        </header>

        {showStats ? (
          <div className="p-8 max-w-[1200px] mx-auto w-full overflow-x-auto">
             <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black uppercase italic">Détails de ma Shasse</h2><button onClick={()=>setShowStats(false)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black">RETOUR DEX</button></div>
             <table className="w-full text-left bg-slate-900/50 text-white rounded-[2rem] overflow-hidden border-collapse">
               <thead className="bg-slate-800 text-[10px] font-black uppercase text-slate-400">
                 <tr><th className="p-6">Pokémon</th><th className="p-6">Surnom</th><th className="p-6">Méthode</th><th className="p-6">Jeu</th></tr>
               </thead>
               <tbody>
                 {shinyStatsData.map((s, i) => (
                   <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                     <td className="p-6 flex items-center gap-4"><img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${s.id}.png`} className="w-12 h-12" />{s.name}</td>
                     <td className="p-6 text-yellow-400 font-bold">{s.nickname || '-'}</td>
                     <td className="p-6">{s.method || '-'}</td>
                     <td className="p-6 uppercase text-[10px] font-black">{s.game || '-'}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 max-w-[1920px] mx-auto w-full">
            {loading ? <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4 text-slate-400"><Loader2 className="animate-spin text-blue-500" size={48}/><p className="font-black uppercase tracking-widest text-xs">Chargement...</p></div> : 
              displayedPokemon.map(p => {
                const entry = collection[modeKey][p.id] || { forms: {} };
                const ownedFormIds = p.forms.filter(f => entry.forms[f.id]).map(f => f.id);
                const isCompleted = ownedFormIds.length > 0;
                return (
                  <div key={p.id} className={`p-6 rounded-[3rem] border-4 transition-all duration-500 flex flex-col items-center cursor-pointer group hover:scale-105 ${isCompleted ? (isShinyMode ? 'border-yellow-400 bg-gradient-to-br from-slate-900 to-yellow-900/20 shadow-2xl shadow-yellow-500/20' : 'border-emerald-400 bg-gradient-to-br from-white to-emerald-50 shadow-2xl shadow-emerald-500/20') : 'border-transparent bg-white/50 opacity-60 shadow-xl'}`} onClick={() => setSelectedInfoPoke({id: p.id, name: p.name})}>
                    <span className="text-[10px] font-black opacity-20 self-start">#{p.id}</span>
                    <div onClick={(e) => { e.stopPropagation(); setSelectedSpritePoke({id: p.id, name: p.name}); }}><AnimatedPokemonImage ownedFormIds={ownedFormIds} isShiny={isShinyMode} defaultId={p.id} /></div>
                    <h3 className="font-black text-xl capitalize mb-6 truncate w-full text-center">{p.name}</h3>
                    <div className="flex flex-wrap justify-center gap-2 mt-auto w-full" onClick={e => e.stopPropagation()}>
                      {p.forms.map(f => {
                        const isOwned = entry.forms[f.id] || false;
                        let label = f.name === p.name.toLowerCase() || f.name.endsWith('-normal') ? 'BASE' : f.name.replace(p.name.toLowerCase(), '').replace('-', ' ').trim().toUpperCase();
                        if (label.length > 12) label = label.substring(0, 10) + '..';
                        return (
                          <button key={f.id} onContextMenu={(e) => { e.preventDefault(); if(isShinyMode && isOwned) setSelectedShinyForm({pId: p.id, fId: f.id, name: p.name}); }} onClick={() => toggleForm(p.id, f.id)} className={`flex-1 min-w-[70px] py-2 px-1 rounded-xl text-[8px] font-black transition-all border-2 ${isOwned ? (isShinyMode ? 'bg-gradient-to-r from-yellow-400 to-amber-500 border-yellow-400 text-black shadow-yellow-500/50' : 'bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500 text-white shadow-emerald-500/50') : 'bg-slate-100 border-transparent text-slate-400 hover:bg-slate-200'}`}>
                            {label} {isShinyMode && isOwned && <Edit3 size={8} className="inline ml-1 opacity-50"/>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}
      </main>

      {/* MODALES V15 + NOUVELLES MODALES */}
      {selectedSpritePoke && <SpriteViewer pokemonId={selectedSpritePoke.id} pokemonName={selectedSpritePoke.name} isShinyMode={isShinyMode} onClose={() => setSelectedSpritePoke(null)} />}
      {selectedInfoPoke && <InfoViewer pokemonId={selectedInfoPoke.id} pokemonName={selectedInfoPoke.name} onClose={() => setSelectedInfoPoke(null)} />}
      {selectedShinyForm && <ShinyDetailModal pokemonName={selectedShinyForm.name} currentData={collection.shiny[selectedShinyForm.pId]?.details?.[selectedShinyForm.fId]} onSave={saveShinyDetails} onClose={() => setSelectedShinyForm(null)} />}

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100, 100, 100, 0.5); border-radius: 10px; } .no-scrollbar::-webkit-scrollbar { display: none; } .image-pixelated { image-rendering: pixelated; }`}</style>
    </div>
  );
};

export default App;