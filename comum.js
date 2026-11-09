/* Arquivo compartilhado entre o site do presente (index.html) e o painel (admin.html).
   Você NÃO precisa editar este arquivo: a conexão é feita pelo próprio painel. */
(function () {
  "use strict";

  var MOTIVOS_PADRAO = [
    "Seu sorriso, que deixa qualquer dia mais leve.",
    "O jeito como você me olha quando acha que eu não estou vendo.",
    "Seu abraço, que é o meu lugar favorito no mundo.",
    "Você me faz rir até a barriga doer.",
    "A paciência que você tem comigo nos meus dias difíceis.",
    "O seu cheiro, que eu reconheceria em qualquer lugar.",
    "Você acredita em mim até quando eu duvido de mim mesma.",
    "Seu jeito carinhoso de cuidar de mim.",
    "As nossas conversas que atravessam a madrugada.",
    "Você torna as coisas simples especiais.",
    "Sua voz dizendo o meu nome.",
    "O jeito como segura a minha mão.",
    "Você é meu melhor amigo.",
    "Sua honestidade, mesmo quando é difícil.",
    "Você me respeita e me valoriza.",
    "Os seus beijos de bom dia.",
    "Seu coração enorme com as pessoas que ama.",
    "Você sempre encontra um jeito de me animar.",
    "As suas manias, que eu aprendi a amar.",
    "Você me faz sentir segura.",
    "O brilho nos seus olhos quando fala do que gosta.",
    "Você comemora as minhas conquistas como se fossem suas.",
    "Seu jeito de me fazer sentir a pessoa mais bonita do mundo.",
    "As nossas piadas internas que só nós entendemos.",
    "Você é a primeira pessoa que eu quero contar tudo.",
    "Seu carinho nos pequenos detalhes.",
    "Você me ensina coisas novas todos os dias.",
    "Com você, até o silêncio é confortável.",
    "Seu jeito de dançar, mesmo sem saber dançar.",
    "Você sonha junto comigo.",
    "A forma como você me abraça por trás.",
    "Você me escuta de verdade.",
    "Sua coragem diante dos desafios.",
    "Você me faz querer ser uma pessoa melhor.",
    "O jeito que você fica bravo e depois ri.",
    "Seus abraços demorados.",
    "Você lembra dos detalhes que eu falo.",
    "Nossas viagens, passeios e aventuras.",
    "O seu jeito de dizer \"eu te amo\".",
    "Você é lindo por dentro e por fora.",
    "Seu cafuné, que é remédio pra tudo.",
    "Você transforma problemas em risadas.",
    "Ao seu lado, eu me sinto em casa.",
    "Você me surpreende de um jeito bom.",
    "A sua dedicação a tudo o que faz.",
    "Seu jeito de me chamar de amor.",
    "Você me aceita exatamente como eu sou.",
    "Cada dia com você é uma página nova da nossa história.",
    "Você é o meu futuro favorito.",
    "Porque é você. Sempre foi você. ❤️"
  ];

  var PADRAO = {
    nomeDele: "",
    nomeDela: "",
    dataInicio: "",
    inicioTitulo: "Para o amor da minha vida ❤️",
    inicioSubtitulo: "Preparei algo especial, feito com todo o meu carinho, só para você.",
    inicioBotao: "Começar a surpresa",
    contadorTexto: "Juntos há",
    galeriaTitulo: "Nossos momentos",
    galeriaSubtitulo: "Cada foto guarda um pedacinho da nossa história.",
    fotos: [],
    motivosTitulo: "50 razões pelas quais eu te amo",
    motivosSubtitulo: "Toque no cartão para revelar cada razão, uma de cada vez.",
    motivos: MOTIVOS_PADRAO.slice(),
    musicaTitulo: "A nossa música",
    musicaSubtitulo: "Aquela que toca e eu lembro de você na hora.",
    musicaBotao: "Tocar a nossa música",
    musicaLink: "",
    finalTitulo: "Uma carta para você",
    finalEnvelope: "Toque para abrir",
    finalMensagem: "Meu amor,\n\nobrigada por cada momento, cada risada e cada abraço. Você chegou e deixou tudo mais bonito.\n\nQue a gente continue escrevendo essa história juntos, um dia de cada vez, para sempre.\n\nEu te amo mais do que as palavras conseguem dizer.",
    finalAssinatura: "Com todo o meu amor",
    encerramento: "Eu te amo, hoje e sempre ❤️",
    botaoMaisAmor: "Toque aqui para mais amor"
  };

  var CHAVE_CFG = "presente_cfg_v1";
  var CHAVE_CACHE = "presente_cache_v1";
  var CHAVE_PREVIA = "presente_previa_v1";
  var CHAVE_RASCUNHO = "presente_rascunho_v1";

  function guardar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) {}
  }
  function ler(chave) {
    try { var v = localStorage.getItem(chave); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function apagar(chave) {
    try { localStorage.removeItem(chave); } catch (e) {}
  }

  function b64(str) {
    return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function deb64(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return decodeURIComponent(escape(atob(str)));
  }

  function normalizarUrl(url) {
    url = String(url || "").trim().replace(/\/+$/, "");
    if (/^[a-z0-9]{15,30}$/i.test(url)) url = "https://" + url + ".supabase.co";
    if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
    return url;
  }

  function codificarConfig(cfg) {
    var u = normalizarUrl(cfg.url);
    var m = u.match(/^https:\/\/([a-z0-9]+)\.supabase\.co$/i);
    return b64(JSON.stringify({ u: m ? m[1] : u, k: cfg.key }));
  }
  function decodificarConfig(txt) {
    try {
      var o = JSON.parse(deb64(txt));
      if (!o || !o.u || !o.k) return null;
      return { url: normalizarUrl(o.u), key: o.k };
    } catch (e) { return null; }
  }

  // Lê a conexão: primeiro do link (#c=...), depois do que já foi guardado neste aparelho.
  function lerConfig() {
    var m = (location.hash || "").match(/[#&]c=([A-Za-z0-9_-]+)/);
    if (m) {
      var cfg = decodificarConfig(m[1]);
      if (cfg) { guardar(CHAVE_CFG, cfg); return cfg; }
    }
    var salvo = ler(CHAVE_CFG);
    if (salvo && salvo.url && salvo.key) return salvo;
    return null;
  }

  var clientePromessa = null;
  function cliente(cfg) {
    if (!clientePromessa) {
      clientePromessa = import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm").then(function (mod) {
        return mod.createClient(cfg.url, cfg.key, { auth: { persistSession: true, storageKey: "presente_sessao" } });
      });
    }
    return clientePromessa;
  }

  function urlFoto(cfg, caminho) {
    if (!caminho) return "";
    if (/^(https?:|data:|blob:)/.test(caminho)) return caminho;
    return cfg ? cfg.url + "/storage/v1/object/public/fotos/" + encodeURI(caminho) : "";
  }

  function completar(dados) {
    var d = JSON.parse(JSON.stringify(PADRAO));
    if (dados && typeof dados === "object") {
      Object.keys(PADRAO).forEach(function (k) {
        if (dados[k] !== undefined && dados[k] !== null) d[k] = dados[k];
      });
    }
    if (!Array.isArray(d.fotos)) d.fotos = [];
    if (!Array.isArray(d.motivos)) d.motivos = MOTIVOS_PADRAO.slice();
    return d;
  }

  // Aceita links como https://open.spotify.com/intl-pt/track/ID?si=...
  function spotifyEmbed(link) {
    var m = String(link || "").match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(track|album|playlist|episode|artist|show)\/([A-Za-z0-9]+)/i);
    if (!m) return null;
    return "https://open.spotify.com/embed/" + m[1].toLowerCase() + "/" + m[2] + "?utm_source=generator&theme=0";
  }

  function diasJuntos(dataTxt) {
    if (!dataTxt) return null;
    var p = String(dataTxt).split("-");
    if (p.length !== 3) return null;
    var inicio = new Date(+p[0], +p[1] - 1, +p[2]);
    if (isNaN(inicio)) return null;
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var dias = Math.round((hoje - inicio) / 86400000);
    return dias >= 0 ? dias : null;
  }

  window.Presente = {
    PADRAO: PADRAO,
    MOTIVOS_PADRAO: MOTIVOS_PADRAO,
    CHAVE_CACHE: CHAVE_CACHE,
    CHAVE_PREVIA: CHAVE_PREVIA,
    CHAVE_RASCUNHO: CHAVE_RASCUNHO,
    CHAVE_CFG: CHAVE_CFG,
    guardar: guardar, ler: ler, apagar: apagar,
    normalizarUrl: normalizarUrl,
    codificarConfig: codificarConfig,
    lerConfig: lerConfig,
    cliente: cliente,
    urlFoto: urlFoto,
    completar: completar,
    spotifyEmbed: spotifyEmbed,
    diasJuntos: diasJuntos
  };
})();
