import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors, Sparkles, Filter, ShoppingBag, Camera } from 'lucide-react';
import './App.css';

const PeramoreWebsite = () => {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylfjCuHnBv9DLy1sepEwGo-yd7QXMf5oZiWGE9lxj4Xgg6ZSGnKmMxRfGHfkgrIBzV/exec";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferenceContact: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [products, setProducts] = useState([]);
  const [galerieItems, setGalerieItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleElements, setVisibleElements] = useState(new Set());
  
  // Modal Image
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [stitches, setStitches] = useState([]);
  
  useEffect(() => {
    const newStitches = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 20 + Math.random() * 15
    }));
    setStitches(newStitches);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=get_products`);
      const data = await response.json();
      
      if (data) {
        const collectionItems = data.filter(item => item.type === 'collection');
        const galerieImages = data.filter(item => item.type === 'galerie');
        
        setProducts(collectionItems);
        setGalerieItems(galerieImages);
        const uniqueCategories = [...new Set(collectionItems.map(p => p.categorie))];
        setCategories(uniqueCategories);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setProducts([]);
      setGalerieItems([]);
      setCategories([]);
      setIsLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'Tout' 
    ? products 
    : products.filter(p => p.categorie === selectedCategory);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('');

    // Nettoyer le numéro de téléphone pour garder le format avec le 0
    const cleanPhone = formData.phone.trim();

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'contact',
          name: formData.name,
          email: formData.email,
          phone: cleanPhone, // Envoi du téléphone nettoyé
          message: formData.message,
          preferenceContact: formData.preferenceContact
        })
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '', preferenceContact: 'email' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <div className="font-poppins bg-gradient-to-br from-slate-50 to-stone-100 relative overflow-hidden">
      {/* Animations de fond */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stitches.map(stitch => (
          <div
            key={stitch.id}
            className="absolute opacity-5"
            style={{
              left: `${stitch.left}%`,
              top: `${stitch.top}%`,
              animation: `float ${stitch.duration}s ease-in-out infinite`,
              animationDelay: `${stitch.delay}s`
            }}
          >
            {stitch.id % 3 === 0 ? (
              <Scissors className="w-12 h-12 text-slate-700" />
            ) : (
              <div className="w-3 h-3 bg-slate-400 rounded-full shadow-sm" />
            )}
          </div>
        ))}
      </div>

  

      {/* MODAL IMAGE */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative w-full min-w-[280px] max-w-5xl min-h-[300px] max-h-[85vh] animate-scaleIn">
            {/* Bouton de fermeture */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white text-slate-700 p-2 sm:p-3 rounded-full shadow-2xl hover:bg-slate-100 transition-all z-20 hover:rotate-90 transform duration-300 group"
              aria-label="Fermer"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Container de l'image avec dimensions contrôlées */}
            <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.nom}
                className="max-w-full max-h-[85vh] min-h-[300px] object-contain"
                onClick={(e) => e.stopPropagation()}
                style={{ width: 'auto', height: 'auto' }}
              />
              
              {/* Overlay avec informations */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-transparent p-4 sm:p-6">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-1 drop-shadow-lg">
                  {selectedImage.nom}
                </h3>
                {selectedImage.categorie && (
                  <p className="text-slate-200 text-xs sm:text-sm drop-shadow-md inline-block bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    {selectedImage.categorie}
                  </p>
                )}
              </div>

              {/* Indicateur de clic pour fermer */}
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm hidden sm:block">
                Cliquez à l'extérieur pour fermer
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg shadow-https://imgur.com/a/2aCuJFqmd z-50 border-b-2 border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => scrollToSection('accueil')}>
              <div className="relative">
              <div class="logo-container">
                <div class="sparkle-group tl">
                  <div class="sparkle large"><div class="circle"></div></div>
                  <div class="sparkle"><div class="star"></div></div>
                  <div class="sparkle"><div class="star"></div></div>
                  <div class="sparkle"><div class="star"></div></div>
                </div>
                <div class="peramore-text">Peramore</div>
                <div class="sparkle-group br">
                  <div class="sparkle"><div class="star"></div></div>
                  <div class="sparkle"><div class="star"></div></div>
                  <div class="sparkle"><div class="star"></div></div>
                  <div class="sparkle large"><div class="circle"></div></div>
                </div>
              </div>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { label: 'Accueil', id: 'accueil' },
                { label: 'Collection', id: 'la-collection' },
                { label: 'Histoire', id: 'notre-histoire' },
                { label: 'Galerie', id: 'galerie' },
                { label: 'Contact', id: 'contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-all duration-300 font-semibold relative group px-5 py-3 rounded-lg text-base"
                >
                  {item.label}
                  <span className="absolute bottom-2 left-5 right-5 h-0.5 bg-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              ))}
            </nav>

            <button 
              className="lg:hidden hover:bg-slate-100 p-3 rounded-xl transition-all active:scale-95"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-7 h-7 text-slate-700" /> : <Menu className="w-7 h-7 text-slate-700" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-2xl animate-fadeInUp">
            <nav className="flex flex-col py-6 px-4 space-y-2 max-w-md mx-auto">
              {[
                { label: 'Accueil', id: 'accueil'},
                { label: 'Collection', id: 'la-collection'},
                { label: 'Histoire', id: 'notre-histoire'},
                { label: 'Galerie', id: 'galerie'},
                { label: 'Contact', id: 'contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all text-left font-semibold py-4 px-5 rounded-xl border-2 border-transparent hover:border-amber-200 active:scale-95 text-lg"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Section Héro */}
      <section id="accueil" className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20">
        <div 
          className="absolute inset-0 opacity-50 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://i.imgur.com/koc5ofM.jpeg')",
            backgroundBlendMode: "overlay" 
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 animate-fadeInUp">
            <div className="relative">
              <Scissors className="w-20 h-20 md:w-28 md:h-28 text-slate-700 transform -rotate-12" />
              <Sparkles className="w-12 h-12 text-amber-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-800 mb-6 leading-tight animate-fadeInUp stagger-1">
            L'art du Denim<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-600">Redessiné</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto animate-fadeInUp stagger-2 font-light">
            Créations artisanales et uniques à partir de jeans recyclés
          </p>
          <button 
            onClick={() => scrollToSection('la-collection')}
            className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-10 py-5 rounded-full text-lg font-semibold hover:from-slate-800 hover:to-slate-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl animate-fadeInUp stagger-3"
          >
            DÉCOUVRIR LA COLLECTION
          </button>
        </div>
      </section>

      {/* La Collection - BOUTIQUE */}
      <section id="la-collection" className="relative py-24 px-4 bg-white" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 ${visibleElements.has('la-collection') ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-12 h-12 text-amber-600" />
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Notre Boutique</h2>
            </div>
            <p className="text-slate-600 mb-8 text-lg">Chaque pièce est confectionnée à la main et possède son propre caractère</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => setSelectedCategory('Tout')} 
                className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === 'Tout' 
                    ? 'bg-slate-800 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" /> Tout
              </button>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === cat 
                      ? 'bg-slate-800 text-white shadow-lg' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600">Chargement...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id || index} 
                  className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 ${
                    visibleElements.has('la-collection') ? `animate-fadeInUp stagger-${(index % 6) + 1}` : 'opacity-0'
                  }`}
                >
                  <div 
                    className="relative h-72 bg-gradient-to-br from-blue-100 via-slate-100 to-amber-50 overflow-hidden cursor-pointer"
                    onClick={() => openImage({ url: product.lien_image, nom: product.nom, categorie: product.categorie })}
                  >
                    {product.lien_image ? (
                      <img 
                        src={product.lien_image} 
                        alt={product.nom} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Scissors className="w-24 h-24 text-slate-300 group-hover:rotate-12 transition-transform" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      {product.prix}€
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-amber-600 transition-colors">
                      {product.nom}
                    </h3>
                    <p className="text-slate-500 text-sm mb-3">Dimensions: {product.dimension}</p>
                    <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {product.categorie}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Aucun produit disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Notre Histoire */}
      <section id="notre-histoire" className="relative py-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50" data-animate>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`order-2 md:order-1 ${visibleElements.has('notre-histoire') ? 'animate-slideInLeft' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-800">Notre Histoire</h2>
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed text-lg">
                  Derrière Peramore se cache une passion pour la transformation. Convaincue que la mode de demain se trouve dans les trésors d'hier, j'ai décidé de donner une seconde vie au denim.
                </p>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Mon objectif est d'allier l'esthétique intemporelle du jean à une démarche éco-responsable. Chaque création est unique, cousue avec soin et amour dans mon atelier.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-12 h-1 bg-amber-500 rounded"></div>
                  <p className="text-slate-600 italic">Fait main avec passion</p>
                </div>
              </div>
            </div>
            <div className={`order-1 md:order-2 ${visibleElements.has('notre-histoire') ? 'animate-slideInRight' : 'opacity-0'}`}>
              <div className="relative">
                <div 
                  className="bg-gradient-to-br from-blue-400 via-slate-300 to-amber-300 rounded-3xl h-96 shadow-2xl overflow-hidden flex items-center justify-center bg-cover bg-center"
                  style={{ backgroundImage: "url('https://i.imgur.com/AbCPit3.png')" }}
                >
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie - PHOTOS UNIQUEMENT */}
      <section id="galerie" className="relative py-24 px-4 bg-white" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${visibleElements.has('galerie') ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="w-12 h-12 text-blue-600" />
              <h2 className="text-4xl md:text-6xl font-bold text-slate-800">Galerie Photo</h2>
            </div>
            <p className="text-slate-600 text-lg">Nos créations en images</p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galerieItems.map((item, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    visibleElements.has('galerie') ? `animate-zoomIn stagger-${(i % 6) + 1}` : 'opacity-0'
                  }`}
                  onClick={() => openImage({ url: item.lien_image, nom: item.nom, categorie: item.categorie })}
                >
                  {item.lien_image ? (
                    <img 
                      src={item.lien_image} 
                      alt={item.nom}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-slate-200 to-amber-200 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && galerieItems.length === 0 && (
            <div className="text-center py-20">
              <Camera className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Aucune photo disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-24 px-4 bg-gradient-to-br from-slate-100 to-blue-100" data-animate>
        <div className="max-w-2xl mx-auto">
          <div className={`text-center mb-12 ${visibleElements.has('contact') ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-slate-800">Contactez-nous</h2>
            <p className="text-slate-600 text-lg">Une envie de création personnalisée ?</p>
          </div>
          
          <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-200 ${visibleElements.has('contact') ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Nom</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all" 
                  placeholder="Votre nom" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all" 
                  placeholder="votre@email.com" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all" 
                  placeholder="06 12 34 56 78" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Préférence de réponse</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferenceContact"
                      value="email"
                      checked={formData.preferenceContact === 'email'}
                      onChange={handleChange}
                      className="w-5 h-5 text-amber-600"
                    />
                    <span className="text-slate-700 font-medium">📧 Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferenceContact"
                      value="sms"
                      checked={formData.preferenceContact === 'sms'}
                      onChange={handleChange}
                      className="w-5 h-5 text-amber-600"
                    />
                    <span className="text-slate-700 font-medium">📱 SMS/Message</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Votre message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows={5} 
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-all resize-none" 
                  placeholder="Décrivez votre projet..."
                />
              </div>
              {submitStatus === 'success' && <div className="text-green-600 font-bold">✓ Message envoyé !</div>}
              <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-slate-800 text-white py-5 rounded-xl font-semibold hover:bg-slate-900 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50">
                {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER MA DEMANDE'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16 px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6"><Sparkles className="w-10 h-10 text-amber-500" /><h3 className="text-3xl font-bold italic">Peramore</h3></div>
        <p className="text-slate-500 text-sm">© 2024 Peramore. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default PeramoreWebsite;