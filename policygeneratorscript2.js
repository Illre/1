;(function () {
  function show(el) {
    el.style.display = ''
  }
  function hide(el) {
    el.style.display = 'none'
  }
  function getRadioValue(name, def) {
    var e = document.querySelectorAll("input[name='" + name + "']")
    if (e.length < 1) {
      return def
    }
    var ret = []
    for (var idx = 0; idx < e.length; ++idx) {
      var el = e[idx]
      if (el.checked) {
        ret.push(el.value)
      }
    }
    return ret
  }
  function toggleClass(element, toggleClass) {
    var currentClass = element.className
    var newClass
    if (hasClass(element, toggleClass)) {
      newClass = currentClass.replace(
        new RegExp('\\b' + toggleClass + '\\b', 'g'),
        ''
      )
    } else {
      newClass = currentClass + ' ' + toggleClass
    }
    element.className = newClass.trim()
  }
  function hasClass(el, c) {
    return el.className.split(' ').indexOf(c) > -1
  }
  function addClass(el, c) {
    if (!hasClass(el, c)) {
      el.className = (el.className + ' ' + c).trim()
    }
  }
  function removeClass(el, c) {
    if (hasClass(el, c)) {
      el.className = el.className
        .replace(new RegExp('\\b' + c + '\\b', 'g'), '')
        .trim()
    }
  }
  function hasClassPrefix(el, p) {
    var classes = el.className.split(' ')
    var l = p.length
    var cmp
    for (var e in classes) {
      cmp = classes[e]
      if (cmp.substring(0, l) === p) {
        return parseInt(cmp.substring(l))
      }
    }
    return false
  }
  function evalCondition(c, def) {
    c = /(.*)(==|!=|\||!\|)(.*)/.exec(c)
    var eName = c[1].trim()
    var eq = c[2]
    var v = c[3]
    if (typeof v === 'undefined') {
      v = 'true'
    } else {
      v = v.trim()
    }
    if (typeof eq === 'undefined') {
      eq = '=='
    }
    var e
    e = document.getElementsByName(eName)
    if (e.length < 1) {
      eName += '[]'
      e = document.getElementsByName(eName)
    }
    if (e.length > 1) {
      e = getRadioValue(eName, '')
    } else {
      if (e.length === 1) {
        e = e[0]
        if (e.matches("input[type='checkbox']")) {
          v = v === 'true' ? true : v
          v = v === 'false' ? false : v
          if (eq === '==') {
            return e.checked == v
          }
          return e.checked != v
        } else {
          e = e.value
        }
      } else {
        if (eName === 'country[]') {
          e = ''
        } else {
          if (eName === 'lang[]') {
            e = 'en'
          } else {
            console.log('Control not found: ' + eName)
            return def
          }
        }
      }
    }
    if (
      typeof e === 'object' &&
      Object.prototype.toString.call(e) !== '[object Array]'
    ) {
      if (eq === '==') {
        return e.indexOf(v) >= 0
      }
      return e.indexOf(v) < 0
    }
    if (eq === '|' || eq === '!|') {
      v = v.split(',').map(function (x) {
        return x.trim()
      })
      if (Object.prototype.toString.call(v) !== '[object Array]') {
        v = [v]
      }
      if (Object.prototype.toString.call(e) !== '[object Array]') {
        e = [e]
      }
      for (var ke in e) {
        var ve = '' + e[ke]
        if (eq === '|') {
          if (v.indexOf(ve) >= 0) {
            return true
          }
        } else {
          if (eq === '!|') {
            if (v.indexOf(ve) < 0) {
              return true
            }
          }
        }
      }
      return false
    } else {
      if (eq === '==') {
        return e == v
      } else {
        if (eq === '===') {
          return e === v
        } else {
          if (eq === '!==') {
            return e !== v
          }
        }
      }
    }
    return e != v
  }
  function isVisible(el) {
    return parseInt(el.offsetWidth) > 0 && parseInt(el.offsetHeight) > 0
  }
  function updateSections() {
    ;[].forEach.call(document.querySelectorAll('wlg_section'), function (el) {
      var s = el.getAttribute('showif')
      var h = el.getAttribute('hideif')
      var v
      if (s) {
        v = evalCondition(s, false)
      } else {
        if (h) {
          v = !evalCondition(h, true)
        }
      }
      if (typeof v != 'undefined') {
        v ? show(el) : hide(el)
      }
    })
    if (typeof updateCountry != 'undefined') {
      updateCountry()
    }
  }
  function updateListeners(selector) {
    var controls = document.querySelectorAll(selector)
    ;[].forEach.call(controls, function (el) {
      ;[].forEach.call(
        el.querySelectorAll("input[type='radio'], input[type='checkbox']"),
        function (control) {
          control.addEventListener('click', updateSections)
        }
      )
      ;[].forEach.call(el.querySelectorAll('select'), function (control) {
        control.addEventListener('change', updateSections)
      })
    })
  }
  updateListeners('.wlg-form-control')
  var state_selector = document.querySelector("#wlg_form [name='state']")
  var STATES = {
    af: {
      'af-bal': 'Balkh',
      'af-bam': 'Bāmyān',
      'af-bdg': 'Bādghīs',
      'af-bds': 'Badakhshān',
      'af-bgl': 'Baghlān',
      'af-day': 'Dāykundī',
      'af-fra': 'Farāh',
      'af-fyb': 'Fāryāb',
      'af-gha': 'Ghaznī',
      'af-gho': 'Ghōr',
      'af-hel': 'Helmand',
      'af-her': 'Herāt',
      'af-jow': 'Jowzjān',
      'af-kab': 'Kābul',
      'af-kan': 'Kandahār',
      'af-kap': 'Kāpīsā',
      'af-kdz': 'Kunduz',
      'af-kho': 'Khōst',
      'af-knr': 'Kunar',
      'af-lag': 'Laghmān',
      'af-log': 'Lōgar',
      'af-nan': 'Nangarhār',
      'af-nim': 'Nīmrōz',
      'af-nur': 'Nūristān',
      'af-pan': 'Panjshayr',
      'af-par': 'Parwān',
      'af-pia': 'Paktiyā',
      'af-pka': 'Paktīkā',
      'af-sam': 'Samangān',
      'af-sar': 'Sar-e Pul',
      'af-tak': 'Takhār',
      'af-uru': 'Uruzgān',
      'af-war': 'Wardak',
      'af-zab': 'Zābul',
    },
    am: {
      'am-ag': 'Aragacotn',
      'am-ar': 'Ararat',
      'am-av': 'Armavir',
      'am-er': 'Erevan',
      'am-gr': "Gegarkunik'",
      'am-kt': "Kotayk'",
      'am-lo': 'Lory',
      'am-sh': 'Sirak',
      'am-su': "Syunik'",
      'am-tv': 'Tavus',
      'am-vd': 'Vayoc Jor',
    },
    ao: {
      'ao-bgo': 'Bengo',
      'ao-bgu': 'Benguela',
      'ao-bie': 'Bié',
      'ao-cab': 'Cabinda',
      'ao-ccu': 'Cuando-Cubango',
      'ao-cnn': 'Cunene',
      'ao-cno': 'Cuanza Norte',
      'ao-cus': 'Cuanza Sul',
      'ao-hua': 'Huambo',
      'ao-hui': 'Huíla',
      'ao-lno': 'Lunda Norte',
      'ao-lsu': 'Lunda Sul',
      'ao-lua': 'Luanda',
      'ao-mal': 'Malange',
      'ao-mox': 'Moxico',
      'ao-nam': 'Namibe',
      'ao-uig': 'Uíge',
      'ao-zai': 'Zaire',
    },
    ar: {
      'ar-a': 'Salta',
      'ar-b': 'Buenos Aires',
      'ar-d': 'San Luis',
      'ar-e': 'Entre Rios',
      'ar-g': 'Santiago del Estero',
      'ar-h': 'Chaco',
      'ar-j': 'San Juan',
      'ar-k': 'Catamarca',
      'ar-l': 'La Pampa',
      'ar-m': 'Mendoza',
      'ar-n': 'Misiones',
      'ar-p': 'Formosa',
      'ar-q': 'Neuquen',
      'ar-r': 'Rio Negro',
      'ar-s': 'Santa Fe',
      'ar-t': 'Tucuman',
      'ar-u': 'Chubut',
      'ar-v': 'Tierra del Fuego',
      'ar-w': 'Corrientes',
      'ar-x': 'Cordoba',
      'ar-y': 'Jujuy',
      'ar-z': 'Santa Cruz',
    },
    at: {
      'at-1': 'Burgenland',
      'at-2': 'Kärnten',
      'at-3': 'Niederösterreich',
      'at-4': 'Oberösterreich',
      'at-5': 'Salzburg',
      'at-6': 'Steiermark',
      'at-7': 'Tirol',
      'at-8': 'Vorarlberg',
      'at-9': 'Wien',
    },
    au: {
      'au-act': 'Australian Capital Territory',
      'au-nsw': 'New South Wales',
      'au-nt': 'Northern Territory',
      'au-qld': 'Queensland',
      'au-sa': 'South Australia',
      'au-tas': 'Tasmania',
      'au-vic': 'Victoria',
      'au-wa': 'Western Australia',
    },
    be: {
      'be-van': 'Antwerpen',
      'be-vbr': 'Vlaams-Brabant',
      'be-vli': 'Limburg',
      'be-vov': 'Oost-Vlaanderen',
      'be-vwv': 'West-Vlaanderen',
      'be-wbr': 'Brabant wallon',
      'be-wht': 'Hainaut',
      'be-wlg': 'Liège',
      'be-wlx': 'Luxembourg',
      'be-wna': 'Namur',
    },
    bf: {
      'bf-bal': 'Balé',
      'bf-bam': 'Bam',
      'bf-ban': 'Banwa',
      'bf-baz': 'Bazèga',
      'bf-bgr': 'Bougouriba',
      'bf-blg': 'Boulgou',
      'bf-blk': 'Boulkiemdé',
      'bf-com': 'Comoé',
      'bf-gan': 'Ganzourgou',
      'bf-gna': 'Gnagna',
      'bf-gou': 'Gourma',
      'bf-hou': 'Houet',
      'bf-iob': 'Ioba',
      'bf-kad': 'Kadiogo',
      'bf-ken': 'Kénédougou',
      'bf-kmd': 'Komondjari',
      'bf-kmp': 'Kompienga',
      'bf-kop': 'Koulpélogo',
      'bf-kos': 'Kossi',
      'bf-kot': 'Kouritenga',
      'bf-kow': 'Kourwéogo',
      'bf-ler': 'Léraba',
      'bf-lor': 'Loroum',
      'bf-mou': 'Mouhoun',
      'bf-nam': 'Namentenga',
      'bf-nao': 'Naouri',
      'bf-nay': 'Nayala',
      'bf-nou': 'Noumbiel',
      'bf-oub': 'Oubritenga',
      'bf-oud': 'Oudalan',
      'bf-pas': 'Passoré',
      'bf-pon': 'Poni',
      'bf-sen': 'Séno',
      'bf-sis': 'Sissili',
      'bf-smt': 'Sanmatenga',
      'bf-sng': 'Sanguié',
      'bf-som': 'Soum',
      'bf-sor': 'Sourou',
      'bf-tap': 'Tapoa',
      'bf-tui': 'Tui',
      'bf-yag': 'Yagha',
      'bf-yat': 'Yatenga',
      'bf-zir': 'Ziro',
      'bf-zon': 'Zondoma',
      'bf-zou': 'Zoundwéogo',
    },
    bi: {
      'bi-bb': 'Bubanza',
      'bi-bl': 'Bujumbura Rural',
      'bi-bm': 'Bujumbura Mairie',
      'bi-br': 'Bururi',
      'bi-ca': 'Cankuzo',
      'bi-ci': 'Cibitoke',
      'bi-gi': 'Gitega',
      'bi-ki': 'Kirundo',
      'bi-kr': 'Karuzi',
      'bi-ky': 'Kayanza',
      'bi-ma': 'Makamba',
      'bi-mu': 'Muramvya',
      'bi-mw': 'Mwaro',
      'bi-ng': 'Ngozi',
      'bi-rt': 'Rutana',
      'bi-ry': 'Ruyigi',
    },
    br: {
      'br-ac': 'Acre',
      'br-al': 'Alagoas',
      'br-am': 'Amazonas',
      'br-ap': 'Amapá',
      'br-ba': 'Bahia',
      'br-ce': 'Ceará',
      'br-es': 'Espírito Santo',
      'br-fn': 'Fernando de Noronha',
      'br-go': 'Goiás',
      'br-ma': 'Maranhão',
      'br-mg': 'Minas Gerais',
      'br-ms': 'Mato Grosso do Sul',
      'br-mt': 'Mato Grosso',
      'br-pa': 'Pará',
      'br-pb': 'Paraíba',
      'br-pe': 'Pernambuco',
      'br-pi': 'Piauí',
      'br-pr': 'Paraná',
      'br-rj': 'Rio de Janeiro',
      'br-rn': 'Rio Grande do Norte',
      'br-ro': 'Rondônia',
      'br-rr': 'Roraima',
      'br-rs': 'Rio Grande do Sul',
      'br-sc': 'Santa Catarina',
      'br-se': 'Sergipe',
      'br-sp': 'São Paulo',
      'br-to': 'Tocantins',
    },
    ca: {
      'ca-ab': 'Alberta',
      'ca-bc': 'British Columbia',
      'ca-mb': 'Manitoba',
      'ca-nb': 'New Brunswick',
      'ca-nl': 'Newfoundland and Labrador',
      'ca-ns': 'Nova Scotia',
      'ca-nt': 'Northwest Territories',
      'ca-nu': 'Nunavut',
      'ca-on': 'Ontario',
      'ca-pe': 'Prince Edward Island',
      'ca-qc': 'Quebec',
      'ca-sk': 'Saskatchewan',
      'ca-yt': 'Yukon Territory',
    },
    cd: {
      'cd-bc': 'Bas-Congo',
      'cd-bn': 'Bandundu',
      'cd-eq': 'Équateur',
      'cd-ka': 'Katanga',
      'cd-ke': 'Kasai-Oriental',
      'cd-kw': 'Kasai-Occidental',
      'cd-ma': 'Maniema',
      'cd-nk': 'Nord-Kivu',
      'cd-or': 'Orientale',
      'cd-sk': 'Sud-Kivu',
    },
    cm: {
      'cm-ad': 'Adamaoua',
      'cm-ce': 'Centre',
      'cm-en': 'Far North',
      'cm-es': 'East',
      'cm-lt': 'Littoral',
      'cm-no': 'North',
      'cm-nw': 'North-West (Cameroon)',
      'cm-ou': 'West',
      'cm-su': 'South',
      'cm-sw': 'South-West',
    },
    cn: {
      'cn-ah': 'Anhui Sheng',
      'cn-fj': 'Fujian Sheng',
      'cn-gd': 'Guangdong Sheng',
      'cn-gs': 'Gansu Sheng',
      'cn-gz': 'Guizhou Sheng',
      'cn-ha': 'Henan Sheng',
      'cn-hb': 'Hubei Sheng',
      'cn-he': 'Hebei Sheng',
      'cn-hi': 'Hainan Sheng',
      'cn-hl': 'Heilongjiang Sheng',
      'cn-hn': 'Hunan Sheng',
      'cn-jl': 'Jilin Sheng',
      'cn-js': 'Jiangsu Sheng',
      'cn-jx': 'Jiangxi Sheng',
      'cn-ln': 'Liaoning Sheng',
      'cn-qh': 'Qinghai Sheng',
      'cn-sc': 'Sichuan Sheng',
      'cn-sd': 'Shandong Sheng',
      'cn-sn': 'Shaanxi Sheng',
      'cn-sx': 'Shanxi Sheng',
      'cn-tw': 'Taiwan Sheng (see also separate country code entry under TW)',
      'cn-yn': 'Yunnan Sheng',
      'cn-zj': 'Zhejiang Sheng',
    },
    cr: {
      'cr-a': 'Alajuela',
      'cr-c': 'Cartago',
      'cr-g': 'Guanacaste',
      'cr-h': 'Heredia',
      'cr-l': 'Limón',
      'cr-p': 'Puntarenas',
      'cr-sj': 'San José',
    },
    cu: {
      'cu-01': 'Pinar del Rio',
      'cu-02': 'La Habana',
      'cu-03': 'Ciudad de La Habana',
      'cu-04': 'Matanzas',
      'cu-05': 'Villa Clara',
      'cu-06': 'Cienfuegos',
      'cu-07': 'Sancti Spíritus',
      'cu-08': 'Ciego de Ávila',
      'cu-09': 'Camagüey',
      'cu-10': 'Las Tunas',
      'cu-11': 'Holguín',
      'cu-12': 'Granma',
      'cu-13': 'Santiago de Cuba',
      'cu-14': 'Guantánamo',
    },
    de: {
      'de-bb': 'Brandenburg',
      'de-be': 'Berlin',
      'de-bw': 'Baden-Württemberg',
      'de-by': 'Bayern',
      'de-hb': 'Bremen',
      'de-he': 'Hessen',
      'de-hh': 'Hamburg',
      'de-mv': 'Mecklenburg-Vorpommern',
      'de-ni': 'Niedersachsen',
      'de-nw': 'Nordrhein-Westfalen',
      'de-rp': 'Rheinland-Pfalz',
      'de-sh': 'Schleswig-Holstein',
      'de-sl': 'Saarland',
      'de-sn': 'Sachsen',
      'de-st': 'Sachsen-Anhalt',
      'de-th': 'Thüringen',
    },
    do: {
      'do-02': 'Azua',
      'do-03': 'Bahoruco',
      'do-04': 'Barahona',
      'do-05': 'Dajabón',
      'do-06': 'Duarte',
      'do-07': 'La Estrelleta [Elías Piña]',
      'do-08': 'El Seybo [El Seibo]',
      'do-09': 'Espaillat',
      'do-10': 'Independencia',
      'do-11': 'La Altagracia',
      'do-12': 'La Romana',
      'do-13': 'La Vega',
      'do-14': 'María Trinidad Sánchez',
      'do-15': 'Monte Cristi',
      'do-16': 'Pedernales',
      'do-17': 'Peravia',
      'do-18': 'Puerto Plata',
      'do-19': 'Salcedo',
      'do-20': 'Samaná',
      'do-21': 'San Cristóbal',
      'do-22': 'San Juan',
      'do-23': 'San Pedro de Macorís',
      'do-24': 'Sánchez Ramírez',
      'do-25': 'Santiago',
      'do-26': 'Santiago Rodríguez',
      'do-27': 'Valverde',
      'do-28': 'Monseñor Nouel',
      'do-29': 'Monte Plata',
      'do-30': 'Hato Mayor',
    },
    dz: {
      'dz-01': 'Adrar',
      'dz-02': 'Chlef',
      'dz-03': 'Laghouat',
      'dz-04': 'Oum el Bouaghi',
      'dz-05': 'Batna',
      'dz-06': 'Béjaïa',
      'dz-07': 'Biskra',
      'dz-08': 'Béchar',
      'dz-09': 'Blida',
      'dz-10': 'Bouira',
      'dz-11': 'Tamanghasset',
      'dz-12': 'Tébessa',
      'dz-13': 'Tlemcen',
      'dz-14': 'Tiaret',
      'dz-15': 'Tizi Ouzou',
      'dz-16': 'Alger',
      'dz-17': 'Djelfa',
      'dz-18': 'Jijel',
      'dz-19': 'Sétif',
      'dz-20': 'Saïda',
      'dz-21': 'Skikda',
      'dz-22': 'Sidi Bel Abbès',
      'dz-23': 'Annaba',
      'dz-24': 'Guelma',
      'dz-25': 'Constantine',
      'dz-26': 'Médéa',
      'dz-27': 'Mostaganem',
      'dz-28': 'Msila',
      'dz-29': 'Mascara',
      'dz-30': 'Ouargla',
      'dz-31': 'Oran',
      'dz-32': 'El Bayadh',
      'dz-33': 'Illizi',
      'dz-34': 'Bordj Bou Arréridj',
      'dz-35': 'Boumerdès',
      'dz-36': 'El Tarf',
      'dz-37': 'Tindouf',
      'dz-38': 'Tissemsilt',
      'dz-39': 'El Oued',
      'dz-40': 'Khenchela',
      'dz-41': 'Souk Ahras',
      'dz-42': 'Tipaza',
      'dz-43': 'Mila',
      'dz-44': 'Aïn Defla',
      'dz-45': 'Naama',
      'dz-46': 'Aïn Témouchent',
      'dz-47': 'Ghardaïa',
      'dz-48': 'Relizane',
    },
    ec: {
      'ec-a': 'Azuay',
      'ec-b': 'Bolívar',
      'ec-c': 'Carchi',
      'ec-d': 'Orellana',
      'ec-e': 'Esmeraldas',
      'ec-f': 'Cañar',
      'ec-g': 'Guayas',
      'ec-h': 'Chimborazo',
      'ec-i': 'Imbabura',
      'ec-l': 'Loja',
      'ec-m': 'Manabí',
      'ec-n': 'Napo',
      'ec-o': 'El Oro',
      'ec-p': 'Pichincha',
      'ec-r': 'Los Ríos',
      'ec-s': 'Morona-Santiago',
      'ec-sd': 'Santo Domingo de los Tsáchilas',
      'ec-se': 'Santa Elena',
      'ec-t': 'Tungurahua',
      'ec-u': 'Sucumbíos',
      'ec-w': 'Galápagos',
      'ec-x': 'Cotopaxi',
      'ec-y': 'Pastaza',
      'ec-z': 'Zamora-Chinchipe',
    },
    er: {
      'er-an': 'Ansabā',
      'er-dk': 'Janūbī al Baḩrī al Aḩmar',
      'er-du': 'Al Janūbī',
      'er-gb': 'Qāsh-Barkah',
      'er-ma': 'Al Awsaţ',
      'er-sk': 'Shimālī al Baḩrī al Aḩmar',
    },
    es: {
      'es-a': 'Alicante',
      'es-ab': 'Albacete',
      'es-al': 'Almería',
      'es-av': 'Ávila',
      'es-b': 'Barcelona',
      'es-ba': 'Badajoz',
      'es-bi': 'Bizkaia',
      'es-bu': 'Burgos',
      'es-c': 'A Coruña',
      'es-ca': 'Cádiz',
      'es-cc': 'Cáceres',
      'es-co': 'Córdoba',
      'es-cr': 'Ciudad Real',
      'es-cs': 'Castellón',
      'es-cu': 'Cuenca',
      'es-gc': 'Las Palmas',
      'es-gi': 'Girona',
      'es-gr': 'Granada',
      'es-gu': 'Guadalajara',
      'es-h': 'Huelva',
      'es-hu': 'Huesca',
      'es-j': 'Jaén',
      'es-l': 'Lleida',
      'es-le': 'León',
      'es-lo': 'La Rioja',
      'es-lu': 'Lugo',
      'es-m': 'Madrid',
      'es-ma': 'Málaga',
      'es-mu': 'Murcia',
      'es-na': 'Navarra / Nafarroa',
      'es-o': 'Asturias',
      'es-or': 'Ourense',
      'es-p': 'Palencia',
      'es-pm': 'Balears',
      'es-po': 'Pontevedra',
      'es-s': 'Cantabria',
      'es-sa': 'Salamanca',
      'es-se': 'Sevilla',
      'es-sg': 'Segovia',
      'es-so': 'Soria',
      'es-ss': 'Gipuzkoa',
      'es-t': 'Tarragona',
      'es-te': 'Teruel',
      'es-tf': 'Santa Cruz de Tenerife',
      'es-to': 'Toledo',
      'es-v': 'Valencia / València',
      'es-va': 'Valladolid',
      'es-vi': 'Álava',
      'es-z': 'Zaragoza',
      'es-za': 'Zamora',
    },
    et: {
      'et-af': 'Āfar',
      'et-am': 'Āmara',
      'et-be': 'Bīnshangul Gumuz',
      'et-ga': 'Gambēla Hizboch',
      'et-ha': 'Hārerī Hizb',
      'et-or': 'Oromīya',
      'et-sn': 'YeDebub Bihēroch Bihēreseboch na Hizboch',
      'et-so': 'Sumalē',
      'et-ti': 'Tigray',
    },
    fm: {
      'fm-ksa': 'Kosrae',
      'fm-pni': 'Pohnpei',
      'fm-trk': 'Chuuk',
      'fm-yap': 'Yap',
    },
    ga: {
      'ga-1': 'Estuaire',
      'ga-2': 'Haut-Ogooué',
      'ga-3': 'Moyen-Ogooué',
      'ga-4': 'Ngounié',
      'ga-5': 'Nyanga',
      'ga-6': 'Ogooué-Ivindo',
      'ga-7': 'Ogooué-Lolo',
      'ga-8': 'Ogooué-Maritime',
      'ga-9': 'Woleu-Ntem',
    },
    gq: {
      'gq-an': 'Annobón',
      'gq-bn': 'Bioko Norte',
      'gq-bs': 'Bioko Sur',
      'gq-cs': 'Centro Sur',
      'gq-kn': 'Kié-Ntem',
      'gq-li': 'Litoral',
      'gq-wn': 'Wele-Nzas',
    },
    gw: {
      'gw-l': 'Leste',
      'gw-n': 'Norte',
      'gw-s': 'Sul',
    },
    id: {
      'id-ba': 'Bali',
      'id-bb': 'Bangka Belitung',
      'id-be': 'Bengkulu',
      'id-bt': 'Banten',
      'id-go': 'Gorontalo',
      'id-ja': 'Jambi',
      'id-jb': 'Jawa Barat',
      'id-ji': 'Jawa Timur',
      'id-jt': 'Jawa Tengah',
      'id-kb': 'Kalimantan Barat',
      'id-ki': 'Kalimantan Timur',
      'id-kr': 'Kepulauan Riau',
      'id-ks': 'Kalimantan Selatan',
      'id-kt': 'Kalimantan Tengah',
      'id-la': 'Lampung',
      'id-ma': 'Maluku',
      'id-mu': 'Maluku Utara',
      'id-nb': 'Nusa Tenggara Barat',
      'id-nt': 'Nusa Tenggara Timur',
      'id-pa': 'Papua',
      'id-pb': 'Papua Barat',
      'id-ri': 'Riau',
      'id-sa': 'Sulawesi Utara',
      'id-sb': 'Sumatra Barat',
      'id-sg': 'Sulawesi Tenggara',
      'id-sn': 'Sulawesi Selatan',
      'id-sr': 'Sulawesi Barat',
      'id-ss': 'Sumatra Selatan',
      'id-st': 'Sulawesi Tengah',
      'id-su': 'Sumatera Utara',
    },
    ie: {
      'ie-c': 'Connacht',
      'ie-l': 'Leinster',
      'ie-m': 'Munster',
      'ie-u': 'Ulster',
    },
    in: {
      'in-ap': 'Andhra Pradesh',
      'in-ar': 'Arunachal Pradesh',
      'in-as': 'Assam',
      'in-br': 'Bihar',
      'in-ct': 'Chhattisgarh',
      'in-ga': 'Goa',
      'in-gj': 'Gujarat',
      'in-hp': 'Himachal Pradesh',
      'in-hr': 'Haryana',
      'in-jh': 'Jharkhand',
      'in-jk': 'Jammu and Kashmir',
      'in-ka': 'Karnataka',
      'in-kl': 'Kerala',
      'in-mh': 'Maharashtra',
      'in-ml': 'Meghalaya',
      'in-mn': 'Manipur',
      'in-mp': 'Madhya Pradesh',
      'in-mz': 'Mizoram',
      'in-nl': 'Nagaland',
      'in-or': 'Odisha',
      'in-pb': 'Punjab',
      'in-rj': 'Rajasthan',
      'in-sk': 'Sikkim',
      'in-tg': 'Telangana',
      'in-tn': 'Tamil Nadu',
      'in-tr': 'Tripura',
      'in-up': 'Uttar Pradesh',
      'in-ut': 'Uttarakhand',
      'in-wb': 'West Bengal',
    },
    ir: {
      'ir-01': 'Āzarbāyjān-e Sharqī',
      'ir-02': 'Āzarbāyjān-e Gharbī',
      'ir-03': 'Ardabīl',
      'ir-04': 'Eşfahān',
      'ir-05': 'Īlām',
      'ir-06': 'Būshehr',
      'ir-07': 'Tehrān',
      'ir-08': 'Chahār Mahāll va Bakhtīārī',
      'ir-10': 'Khūzestān',
      'ir-11': 'Zanjān',
      'ir-12': 'Semnān',
      'ir-13': 'Sīstān va Balūchestān',
      'ir-14': 'Fārs',
      'ir-15': 'Kermān',
      'ir-16': 'Kordestān',
      'ir-17': 'Kermānshāh',
      'ir-18': 'Kohgīlūyeh va Būyer Ahmad',
      'ir-19': 'Gīlān',
      'ir-20': 'Lorestān',
      'ir-21': 'Māzandarān',
      'ir-22': 'Markazī',
      'ir-23': 'Hormozgān',
      'ir-24': 'Hamadān',
      'ir-25': 'Yazd',
      'ir-26': 'Qom',
      'ir-27': 'Golestān',
      'ir-28': 'Qazvīn',
      'ir-29': 'Khorāsān-e Janūbī',
      'ir-30': 'Khorāsān-e Razavī',
      'ir-31': 'Khorāsān-e Shemālī',
    },
    it: {
      'it-ag': 'Agrigento',
      'it-al': 'Alessandria',
      'it-an': 'Ancona',
      'it-ao': 'Aosta',
      'it-ap': 'Ascoli Piceno',
      'it-aq': "L'Aquila",
      'it-ar': 'Arezzo',
      'it-at': 'Asti',
      'it-av': 'Avellino',
      'it-ba': 'Bari',
      'it-bg': 'Bergamo',
      'it-bi': 'Biella',
      'it-bl': 'Belluno',
      'it-bn': 'Benevento',
      'it-bo': 'Bologna',
      'it-br': 'Brindisi',
      'it-bs': 'Brescia',
      'it-bt': 'Barletta-Andria-Trani',
      'it-bz': 'Bolzano',
      'it-ca': 'Cagliari',
      'it-cb': 'Campobasso',
      'it-ce': 'Caserta',
      'it-ch': 'Chieti',
      'it-ci': 'Carbonia-Iglesias',
      'it-cl': 'Caltanissetta',
      'it-cn': 'Cuneo',
      'it-co': 'Como',
      'it-cr': 'Cremona',
      'it-cs': 'Cosenza',
      'it-ct': 'Catania',
      'it-cz': 'Catanzaro',
      'it-en': 'Enna',
      'it-fc': 'Forlì-Cesena',
      'it-fe': 'Ferrara',
      'it-fg': 'Foggia',
      'it-fi': 'Firenze',
      'it-fm': 'Fermo',
      'it-fr': 'Frosinone',
      'it-ge': 'Genova',
      'it-go': 'Gorizia',
      'it-gr': 'Grosseto',
      'it-im': 'Imperia',
      'it-is': 'Isernia',
      'it-kr': 'Crotone',
      'it-lc': 'Lecco',
      'it-le': 'Lecce',
      'it-li': 'Livorno',
      'it-lo': 'Lodi',
      'it-lt': 'Latina',
      'it-lu': 'Lucca',
      'it-mb': 'Monza e Brianza',
      'it-mc': 'Macerata',
      'it-me': 'Messina',
      'it-mi': 'Milano',
      'it-mn': 'Mantova',
      'it-mo': 'Modena',
      'it-ms': 'Massa-Carrara',
      'it-mt': 'Matera',
      'it-na': 'Napoli',
      'it-no': 'Novara',
      'it-nu': 'Nuoro',
      'it-og': 'Ogliastra',
      'it-or': 'Oristano',
      'it-ot': 'Olbia-Tempio',
      'it-pa': 'Palermo',
      'it-pc': 'Piacenza',
      'it-pd': 'Padova',
      'it-pe': 'Pescara',
      'it-pg': 'Perugia',
      'it-pi': 'Pisa',
      'it-pn': 'Pordenone',
      'it-po': 'Prato',
      'it-pr': 'Parma',
      'it-pt': 'Pistoia',
      'it-pu': 'Pesaro e Urbino',
      'it-pv': 'Pavia',
      'it-pz': 'Potenza',
      'it-ra': 'Ravenna',
      'it-rc': 'Reggio Calabria',
      'it-re': 'Reggio Emilia',
      'it-rg': 'Ragusa',
      'it-ri': 'Rieti',
      'it-rm': 'Roma',
      'it-rn': 'Rimini',
      'it-ro': 'Rovigo',
      'it-sa': 'Salerno',
      'it-si': 'Siena',
      'it-so': 'Sondrio',
      'it-sp': 'La Spezia',
      'it-sr': 'Siracusa',
      'it-ss': 'Sassari',
      'it-sv': 'Savona',
      'it-ta': 'Taranto',
      'it-te': 'Teramo',
      'it-tn': 'Trento',
      'it-to': 'Torino',
      'it-tp': 'Trapani',
      'it-tr': 'Terni',
      'it-ts': 'Trieste',
      'it-tv': 'Treviso',
      'it-ud': 'Udine',
      'it-va': 'Varese',
      'it-vb': 'Verbano-Cusio-Ossola',
      'it-vc': 'Vercelli',
      'it-ve': 'Venezia',
      'it-vi': 'Vicenza',
      'it-vr': 'Verona',
      'it-vs': 'Medio Campidano',
      'it-vt': 'Viterbo',
      'it-vv': 'Vibo Valentia',
    },
    ke: {
      'ke-110': 'Nairobi Municipality',
      'ke-200': 'Central',
      'ke-300': 'Coast',
      'ke-400': 'Eastern',
      'ke-500': 'North-Eastern Kaskazini Mashariki',
      'ke-700': 'Rift Valley',
      'ke-800': 'Western Magharibi',
    },
    kh: {
      'kh-1': 'Banteay Mean Chey',
      'kh-10': 'Krachoh',
      'kh-11': 'Mondol Kiri',
      'kh-13': 'Preah Vihear',
      'kh-14': 'Prey Veaeng',
      'kh-15': 'Pousaat',
      'kh-16': 'Rotanak Kiri',
      'kh-17': 'Siem Reab',
      'kh-19': 'Stueng Traeng',
      'kh-2': 'Battambang',
      'kh-20': 'Svaay Rieng',
      'kh-21': 'Taakaev',
      'kh-22': 'Otdar Mean Chey',
      'kh-3': 'Kampong Cham',
      'kh-4': 'Kampong Chhnang',
      'kh-5': 'Kampong Speu',
      'kh-6': 'Kampong Thom',
      'kh-7': 'Kampot',
      'kh-8': 'Kandal',
      'kh-9': 'Kach Kong',
    },
    kn: {
      'kn-k': 'Saint Kitts',
      'kn-n': 'Nevis',
    },
    kp: {
      'kp-02': 'P\u2019yŏngan-namdo',
      'kp-03': 'P\u2019yŏngan-bukto',
      'kp-04': 'Chagang-do',
      'kp-05': 'Hwanghae-namdo',
      'kp-06': 'Hwanghae-bukto',
      'kp-07': 'Kangwŏn-do',
      'kp-08': 'Hamgyŏng-namdo',
      'kp-09': 'Hamgyŏng-bukto',
      'kp-10': 'Yanggang-do',
    },
    kr: {
      'kr-41': 'Gyeonggido',
      'kr-42': "Gang'weondo",
      'kr-43': 'Chungcheongbukdo',
      'kr-44': 'Chungcheongnamdo',
      'kr-45': 'Jeonrabukdo',
      'kr-46': 'Jeonranamdo',
      'kr-47': 'Gyeongsangbukdo',
      'kr-48': 'Gyeongsangnamdo',
      'kr-49': 'Jejudo',
    },
    la: {
      'la-at': 'Attapu',
      'la-bk': 'Bokèo',
      'la-bl': 'Bolikhamxai',
      'la-ch': 'Champasak',
      'la-ho': 'Houaphan',
      'la-kh': 'Khammouan',
      'la-lm': 'Louang Namtha',
      'la-lp': 'Louangphabang',
      'la-ou': 'Oudômxai',
      'la-ph': 'Phôngsali',
      'la-sl': 'Salavan',
      'la-sv': 'Savannakhét',
      'la-vi': 'Vientiane',
      'la-xa': 'Xaignabouli',
      'la-xe': 'Xékong',
      'la-xi': 'Xiangkhouang',
      'la-xs': 'Xaisômboun',
    },
    lk: {
      'lk-1': 'Basnāhira paḷāta',
      'lk-2': 'Madhyama paḷāta',
      'lk-3': 'Dakuṇu paḷāta',
      'lk-4': 'Uturu paḷāta',
      'lk-5': 'Næ̆gĕnahira paḷāta',
      'lk-6': 'Vayamba paḷāta',
      'lk-7': 'Uturumæ̆da paḷāta',
      'lk-8': 'Ūva paḷāta',
      'lk-9': 'Sabaragamuva paḷāta',
    },
    ma: {
      'ma-aou': 'Aousserd (EH)',
      'ma-asz': 'Assa-Zag (EH-partial)',
      'ma-azi': 'Azilal',
      'ma-bem': 'Béni Mellal',
      'ma-ber': 'Berkane',
      'ma-bes': 'Benslimane',
      'ma-bod': 'Boujdour (EH)',
      'ma-bom': 'Boulemane',
      'ma-brr': 'Berrechid',
      'ma-che': 'Chefchaouen',
      'ma-chi': 'Chichaoua',
      'ma-cht': 'Chtouka-Ait Baha',
      'ma-dri': 'Driouch',
      'ma-err': 'Errachidia',
      'ma-esi': 'Essaouira',
      'ma-esm': 'Es-Semara (EH-partial)',
      'ma-fah': 'Fahs-Anjra',
      'ma-fig': 'Figuig',
      'ma-fqh': 'Fquih Ben Salah',
      'ma-gue': 'Guelmim',
      'ma-guf': 'Guercif',
      'ma-haj': 'El Hajeb',
      'ma-hao': 'Al Haouz',
      'ma-hoc': 'Al Hoceïma',
      'ma-ifr': 'Ifrane',
      'ma-jdi': 'El Jadida',
      'ma-jra': 'Jerada',
      'ma-ken': 'Kénitra',
      'ma-kes': 'El Kelâa des Sraghna',
      'ma-khe': 'Khemisset',
      'ma-khn': 'Khenifra',
      'ma-kho': 'Khouribga',
      'ma-laa': 'Laâyoune (EH)',
      'ma-lar': 'Larache',
      'ma-med': 'Médiouna',
      'ma-mid': 'Midelt',
      'ma-mou': 'Moulay Yacoub',
      'ma-nad': 'Nador',
      'ma-nou': 'Nouaceur',
      'ma-oua': 'Ouarzazate',
      'ma-oud': 'Oued Ed-Dahab (EH)',
      'ma-ouz': 'Ouezzane',
      'ma-reh': 'Rehamna',
      'ma-saf': 'Safi',
      'ma-sef': 'Sefrou',
      'ma-set': 'Settat',
      'ma-sib': 'Sidi Bennour',
      'ma-sif': 'Sidi Ifni',
      'ma-sik': 'Sidi Kacem',
      'ma-sil': 'Sidi Slimane',
      'ma-taf': 'Tarfaya (EH-partial)',
      'ma-tai': 'Taourirt',
      'ma-tao': 'Taounate',
      'ma-tar': 'Taroudant',
      'ma-tat': 'Tata',
      'ma-taz': 'Taza',
      'ma-tet': 'Tétouan',
      'ma-tin': 'Tinghir',
      'ma-tiz': 'Tiznit',
      'ma-tnt': 'Tan-Tan (EH-partial)',
      'ma-yus': 'Youssoufia',
      'ma-zag': 'Zagora',
    },
    mm: {
      'mm-11': 'Kachin',
      'mm-12': 'Kayah',
      'mm-13': 'Kayin',
      'mm-14': 'Chin',
      'mm-15': 'Mon',
      'mm-16': 'Rakhine',
      'mm-17': 'Shan',
    },
    mn: {
      'mn-039': 'Hentiy',
      'mn-041': 'Hövsgöl',
      'mn-043': 'Hovd',
      'mn-046': 'Uvs',
      'mn-047': 'Töv',
      'mn-049': 'Selenge',
      'mn-051': 'Sühbaatar',
      'mn-053': 'Ömnögovi',
      'mn-055': 'Övörhangay',
      'mn-057': 'Dzavhan',
      'mn-059': 'Dundgovi',
      'mn-061': 'Dornod',
      'mn-063': 'Dornogovi',
      'mn-065': 'Govi-Altay',
      'mn-067': 'Bulgan',
      'mn-069': 'Bayanhongor',
      'mn-071': 'Bayan-Ölgiy',
      'mn-073': 'Arhangay',
    },
    mv: {
      'mv-ce': 'Central',
      'mv-nc': 'North Central',
      'mv-no': 'North',
      'mv-sc': 'South Central',
      'mv-su': 'South',
      'mv-un': 'Upper North',
      'mv-us': 'Upper South',
    },
    mx: {
      'mx-agu': 'Aguascalientes',
      'mx-bcn': 'Baja California',
      'mx-bcs': 'Baja California Sur',
      'mx-cam': 'Campeche',
      'mx-chh': 'Chihuahua',
      'mx-chp': 'Chiapas',
      'mx-coa': 'Coahuila de Zaragoza',
      'mx-col': 'Colima',
      'mx-dur': 'Durango',
      'mx-gro': 'Guerrero',
      'mx-gua': 'Guanajuato',
      'mx-hid': 'Hidalgo',
      'mx-jal': 'Jalisco',
      'mx-mex': 'México',
      'mx-mic': 'Michoacán de Ocampo',
      'mx-mor': 'Morelos',
      'mx-nay': 'Nayarit',
      'mx-nle': 'Nuevo León',
      'mx-oax': 'Oaxaca',
      'mx-pue': 'Puebla',
      'mx-que': 'Querétaro',
      'mx-roo': 'Quintana Roo',
      'mx-sin': 'Sinaloa',
      'mx-slp': 'San Luis Potosí',
      'mx-son': 'Sonora',
      'mx-tab': 'Tabasco',
      'mx-tam': 'Tamaulipas',
      'mx-tla': 'Tlaxcala',
      'mx-ver': 'Veracruz de Ignacio de la Llave',
      'mx-yuc': 'Yucatán',
      'mx-zac': 'Zacatecas',
    },
    my: {
      'my-01': 'Johor',
      'my-02': 'Kedah',
      'my-03': 'Kelantan',
      'my-04': 'Melaka',
      'my-05': 'Negeri Sembilan',
      'my-06': 'Pahang',
      'my-07': 'Pulau Pinang',
      'my-08': 'Perak',
      'my-09': 'Perlis',
      'my-10': 'Selangor',
      'my-11': 'Terengganu',
      'my-12': 'Sabah',
      'my-13': 'Sarawak',
    },
    mz: {
      'mz-a': 'Niassa',
      'mz-b': 'Manica',
      'mz-g': 'Gaza',
      'mz-i': 'Inhambane',
      'mz-l': 'Maputo',
      'mz-n': 'Numpula',
      'mz-p': 'Cabo Delgado',
      'mz-q': 'Zambezia',
      'mz-s': 'Sofala',
      'mz-t': 'Tete',
    },
    ng: {
      'ng-ab': 'Abia',
      'ng-ad': 'Adamawa',
      'ng-ak': 'Akwa Ibom',
      'ng-an': 'Anambra',
      'ng-ba': 'Bauchi',
      'ng-be': 'Benue',
      'ng-bo': 'Borno',
      'ng-by': 'Bayelsa',
      'ng-cr': 'Cross River',
      'ng-de': 'Delta',
      'ng-eb': 'Ebonyi',
      'ng-ed': 'Edo',
      'ng-ek': 'Ekiti',
      'ng-en': 'Enugu',
      'ng-go': 'Gombe',
      'ng-im': 'Imo',
      'ng-ji': 'Jigawa',
      'ng-kd': 'Kaduna',
      'ng-ke': 'Kebbi',
      'ng-kn': 'Kano',
      'ng-ko': 'Kogi',
      'ng-kt': 'Katsina',
      'ng-kw': 'Kwara',
      'ng-la': 'Lagos',
      'ng-na': 'Nassarawa',
      'ng-ni': 'Niger',
      'ng-og': 'Ogun',
      'ng-on': 'Ondo',
      'ng-os': 'Osun',
      'ng-oy': 'Oyo',
      'ng-pl': 'Plateau',
      'ng-ri': 'Rivers',
      'ng-so': 'Sokoto',
      'ng-ta': 'Taraba',
      'ng-yo': 'Yobe',
      'ng-za': 'Zamfara',
    },
    nl: {
      'nl-dr': 'Drenthe',
      'nl-fl': 'Flevoland',
      'nl-fr': 'Friesland',
      'nl-ge': 'Gelderland',
      'nl-gr': 'Groningen',
      'nl-li': 'Limburg',
      'nl-nb': 'Noord-Brabant',
      'nl-nh': 'Noord-Holland',
      'nl-ov': 'Overijssel',
      'nl-ut': 'Utrecht',
      'nl-ze': 'Zeeland',
      'nl-zh': 'Zuid-Holland',
    },
    pa: {
      'pa-1': 'Bocas del Toro',
      'pa-2': 'Coclé',
      'pa-3': 'Colón',
      'pa-4': 'Chiriquí',
      'pa-5': 'Darién',
      'pa-6': 'Herrera',
      'pa-7': 'Los Santos',
      'pa-8': 'Panamá',
      'pa-9': 'Veraguas',
    },
    pg: {
      'pg-cpk': 'Chimbu',
      'pg-cpm': 'Central',
      'pg-ebr': 'East New Britain',
      'pg-ehg': 'Eastern Highlands',
      'pg-epw': 'Enga',
      'pg-esw': 'East Sepik',
      'pg-gpk': 'Gulf',
      'pg-mba': 'Milne Bay',
      'pg-mpl': 'Morobe',
      'pg-mpm': 'Madang',
      'pg-mrl': 'Manus',
      'pg-nik': 'New Ireland',
      'pg-npp': 'Northern',
      'pg-san': 'Sandaun',
      'pg-shm': 'Southern Highlands',
      'pg-wbk': 'West New Britain',
      'pg-whm': 'Western Highlands',
      'pg-wpd': 'Western',
    },
    ph: {
      'ph-abr': 'Abra',
      'ph-agn': 'Agusan del Norte',
      'ph-ags': 'Agusan del Sur',
      'ph-akl': 'Aklan',
      'ph-alb': 'Albay',
      'ph-ant': 'Antique',
      'ph-apa': 'Apayao',
      'ph-aur': 'Aurora',
      'ph-ban': 'Batasn',
      'ph-bas': 'Basilan',
      'ph-ben': 'Benguet',
      'ph-bil': 'Biliran',
      'ph-boh': 'Bohol',
      'ph-btg': 'Batangas',
      'ph-btn': 'Batanes',
      'ph-buk': 'Bukidnon',
      'ph-bul': 'Bulacan',
      'ph-cag': 'Cagayan',
      'ph-cam': 'Camiguin',
      'ph-can': 'Camarines Norte',
      'ph-cap': 'Capiz',
      'ph-cas': 'Camarines Sur',
      'ph-cat': 'Catanduanes',
      'ph-cav': 'Cavite',
      'ph-ceb': 'Cebu',
      'ph-com': 'Compostela Valley',
      'ph-dao': 'Davao Oriental',
      'ph-das': 'Davao del Sur',
      'ph-dav': 'Davao del Norte',
      'ph-din': 'Dinagat Islands',
      'ph-eas': 'Eastern Samar',
      'ph-gui': 'Guimaras',
      'ph-ifu': 'Ifugao',
      'ph-ili': 'Iloilo',
      'ph-iln': 'Ilocos Norte',
      'ph-ils': 'Ilocos Sur',
      'ph-isa': 'Isabela',
      'ph-kal': 'Kalinga-Apayso',
      'ph-lag': 'Laguna',
      'ph-lan': 'Lanao del Norte',
      'ph-las': 'Lanao del Sur',
      'ph-ley': 'Leyte',
      'ph-lun': 'La Union',
      'ph-mad': 'Marinduque',
      'ph-mag': 'Maguindanao',
      'ph-mas': 'Masbate',
      'ph-mdc': 'Mindoro Occidental',
      'ph-mdr': 'Mindoro Oriental',
      'ph-mou': 'Mountain Province',
      'ph-msc': 'Misamis Occidental',
      'ph-msr': 'Misamis Oriental',
      'ph-nco': 'North Cotabato',
      'ph-nec': 'Negros Occidental',
      'ph-ner': 'Negros Oriental',
      'ph-nsa': 'Northern Samar',
      'ph-nue': 'Nueva Ecija',
      'ph-nuv': 'Nueva Vizcaya',
      'ph-pam': 'Pampanga',
      'ph-pan': 'Pangasinan',
      'ph-plw': 'Palawan',
      'ph-que': 'Quezon',
      'ph-qui': 'Quirino',
      'ph-riz': 'Rizal',
      'ph-rom': 'Romblon',
      'ph-sar': 'Sarangani',
      'ph-sco': 'South Cotabato',
      'ph-sig': 'Siquijor',
      'ph-sle': 'Southern Leyte',
      'ph-slu': 'Sulu',
      'ph-sor': 'Sorsogon',
      'ph-suk': 'Sultan Kudarat',
      'ph-sun': 'Surigao del Norte',
      'ph-sur': 'Surigao del Sur',
      'ph-tar': 'Tarlac',
      'ph-taw': 'Tawi-Tawi',
      'ph-wsa': 'Western Samar',
      'ph-zan': 'Zamboanga del Norte',
      'ph-zas': 'Zamboanga del Sur',
      'ph-zmb': 'Zambales',
      'ph-zsi': 'Zamboanga Sibugay',
    },
    pk: {
      'pk-ba': 'Balochistan',
      'pk-kp': 'Khyber Pakhtunkhwa',
      'pk-pb': 'Punjab',
      'pk-sd': 'Sindh',
      'pk-ta': 'Federally Administered Tribal Areas',
    },
    pl: {
      'pl-ds': 'Dolnośląskie',
      'pl-kp': 'Kujawsko-pomorskie',
      'pl-lb': 'Lubuskie',
      'pl-ld': 'Łódzkie',
      'pl-lu': 'Lubelskie',
      'pl-ma': 'Małopolskie',
      'pl-mz': 'Mazowieckie',
      'pl-op': 'Opolskie',
      'pl-pd': 'Podlaskie',
      'pl-pk': 'Podkarpackie',
      'pl-pm': 'Pomorskie',
      'pl-sk': 'Świętokrzyskie',
      'pl-sl': 'Śląskie',
      'pl-wn': 'Warmińsko-mazurskie',
      'pl-wp': 'Wielkopolskie',
      'pl-zp': 'Zachodniopomorskie',
    },
    pw: {
      'pw-002': 'Aimeliik',
      'pw-004': 'Airai',
      'pw-010': 'Angaur',
      'pw-050': 'Hatobohei',
      'pw-100': 'Kayangel',
      'pw-150': 'Koror',
      'pw-212': 'Melekeok',
      'pw-214': 'Ngaraard',
      'pw-218': 'Ngarchelong',
      'pw-222': 'Ngardmau',
      'pw-224': 'Ngatpang',
      'pw-226': 'Ngchesar',
      'pw-227': 'Ngeremlengui',
      'pw-228': 'Ngiwal',
      'pw-350': 'Peleliu',
      'pw-370': 'Sonsorol',
    },
    rw: {
      'rw-02': 'Est',
      'rw-03': 'Nord',
      'rw-04': 'Ouest',
      'rw-05': 'Sud',
    },
    sa: {
      'sa-01': 'Ar Riyāḍ',
      'sa-02': 'Makkah',
      'sa-03': 'Al Madīnah',
      'sa-04': 'Ash Sharqīyah',
      'sa-05': 'Al Qaşīm',
      'sa-06': "Ḥā'il",
      'sa-07': 'Tabūk',
      'sa-08': 'Al Ḥudūd ash Shamāliyah',
      'sa-09': 'Jīzan',
      'sa-10': 'Najrān',
      'sa-11': 'Al Bāhah',
      'sa-12': 'Al Jawf',
      'sa-14': '`Asīr',
    },
    sb: {
      'sb-ce': 'Central',
      'sb-ch': 'Choiseul',
      'sb-gu': 'Guadalcanal',
      'sb-is': 'Isabel',
      'sb-mk': 'Makira',
      'sb-ml': 'Malaita',
      'sb-rb': 'Rennell and Bellona',
      'sb-te': 'Temotu',
      'sb-we': 'Western',
    },
    sd: {
      'sd-dc': 'Zalingei',
      'sd-de': 'Sharq Dārfūr',
      'sd-dn': 'Shamāl Dārfūr',
      'sd-ds': 'Janūb Dārfūr',
      'sd-dw': 'Gharb Dārfūr',
      'sd-gd': 'Al Qaḑārif',
      'sd-gz': 'Al Jazīrah',
      'sd-ka': 'Kassalā',
      'sd-kh': 'Al Kharţūm',
      'sd-kn': 'Shamāl Kurdufān',
      'sd-ks': 'Janūb Kurdufān',
      'sd-nb': 'An Nīl al Azraq',
      'sd-no': 'Ash Shamālīyah',
      'sd-nr': 'An Nīl',
      'sd-nw': 'An Nīl al Abyaḑ',
      'sd-rs': 'Al Baḩr al Aḩmar',
      'sd-si': 'Sinnār',
    },
    sl: {
      'sl-e': 'Eastern',
      'sl-n': 'Northern',
      'sl-s': 'Southern (Sierra Leone)',
    },
    ss: {
      'ss-bn': 'Northern Bahr el-Ghazal',
      'ss-bw': 'Western Bahr el-Ghazal',
      'ss-ec': 'Central Equatoria',
      'ss-ee8': 'Eastern Equatoria',
      'ss-ew': 'Western Equatoria',
      'ss-jg': 'Jonglei',
      'ss-lk': 'Lakes',
      'ss-nu': 'Upper Nile',
      'ss-uy': 'Unity',
      'ss-wr': 'Warrap',
    },
    th: {
      'th-11': 'Samut Prakan',
      'th-12': 'Nonthaburi',
      'th-13': 'Pathum Thani',
      'th-14': 'Phra Nakhon Si Ayutthaya',
      'th-15': 'Ang Thong',
      'th-16': 'Lop Buri',
      'th-17': 'Sing Buri',
      'th-18': 'Chai Nat',
      'th-19': 'Saraburi',
      'th-20': 'Chon Buri',
      'th-21': 'Rayong',
      'th-22': 'Chanthaburi',
      'th-23': 'Trat',
      'th-24': 'Chachoengsao',
      'th-25': 'Prachin Buri',
      'th-26': 'Nakhon Nayok',
      'th-27': 'Sa Kaeo',
      'th-30': 'Nakhon Ratchasima',
      'th-31': 'Buri Ram',
      'th-32': 'Surin',
      'th-33': 'Si Sa Ket',
      'th-34': 'Ubon Ratchathani',
      'th-35': 'Yasothon',
      'th-36': 'Chaiyaphum',
      'th-37': 'Amnat Charoen',
      'th-39': 'Nong Bua Lam Phu',
      'th-40': 'Khon Kaen',
      'th-41': 'Udon Thani',
      'th-42': 'Loei',
      'th-43': 'Nong Khai',
      'th-44': 'Maha Sarakham',
      'th-45': 'Roi Et',
      'th-46': 'Kalasin',
      'th-47': 'Sakon Nakhon',
      'th-48': 'Nakhon Phanom',
      'th-49': 'Mukdahan',
      'th-50': 'Chiang Mai',
      'th-51': 'Lamphun',
      'th-52': 'Lampang',
      'th-53': 'Uttaradit',
      'th-54': 'Phrae',
      'th-55': 'Nan',
      'th-56': 'Phayao',
      'th-57': 'Chiang Rai',
      'th-58': 'Mae Hong Son',
      'th-60': 'Nakhon Sawan',
      'th-61': 'Uthai Thani',
      'th-62': 'Kamphaeng Phet',
      'th-63': 'Tak',
      'th-64': 'Sukhothai',
      'th-65': 'Phitsanulok',
      'th-66': 'Phichit',
      'th-67': 'Phetchabun',
      'th-70': 'Ratchaburi',
      'th-71': 'Kanchanaburi',
      'th-72': 'Suphan Buri',
      'th-73': 'Nakhon Pathom',
      'th-74': 'Samut Sakhon',
      'th-75': 'Samut Songkhram',
      'th-76': 'Phetchaburi',
      'th-77': 'Prachuap Khiri Khan',
      'th-80': 'Nakhon Si Thammarat',
      'th-81': 'Krabi',
      'th-82': 'Phangnga',
      'th-83': 'Phuket',
      'th-84': 'Surat Thani',
      'th-85': 'Ranong',
      'th-86': 'Chumphon',
      'th-90': 'Songkhla',
      'th-91': 'Satun',
      'th-92': 'Trang',
      'th-93': 'Phatthalung',
      'th-94': 'Pattani',
      'th-95': 'Yala',
      'th-96': 'Narathiwat',
      'th-s': 'Phatthaya',
    },
    tr: {
      'tr-01': 'Adana',
      'tr-02': 'Adıyaman',
      'tr-03': 'Afyonkarahisar',
      'tr-04': 'Ağrı',
      'tr-05': 'Amasya',
      'tr-06': 'Ankara',
      'tr-07': 'Antalya',
      'tr-08': 'Artvin',
      'tr-09': 'Aydın',
      'tr-10': 'Balıkesir',
      'tr-11': 'Bilecik',
      'tr-12': 'Bingöl',
      'tr-13': 'Bitlis',
      'tr-14': 'Bolu',
      'tr-15': 'Burdur',
      'tr-16': 'Bursa',
      'tr-17': 'Çanakkale',
      'tr-18': 'Çankırı',
      'tr-19': 'Çorum',
      'tr-20': 'Denizli',
      'tr-21': 'Diyarbakır',
      'tr-22': 'Edirne',
      'tr-23': 'Elazığ',
      'tr-24': 'Erzincan',
      'tr-25': 'Erzurum',
      'tr-26': 'Eskişehir',
      'tr-27': 'Gaziantep',
      'tr-28': 'Giresun',
      'tr-29': 'Gümüşhane',
      'tr-30': 'Hakkâri',
      'tr-31': 'Hatay',
      'tr-32': 'Isparta',
      'tr-33': 'Mersin',
      'tr-34': 'İstanbul',
      'tr-35': 'İzmir',
      'tr-36': 'Kars',
      'tr-37': 'Kastamonu',
      'tr-38': 'Kayseri',
      'tr-39': 'Kırklareli',
      'tr-40': 'Kırşehir',
      'tr-41': 'Kocaeli',
      'tr-42': 'Konya',
      'tr-43': 'Kütahya',
      'tr-44': 'Malatya',
      'tr-45': 'Manisa',
      'tr-46': 'Kahramanmaraş',
      'tr-47': 'Mardin',
      'tr-48': 'Muğla',
      'tr-49': 'Muş',
      'tr-50': 'Nevşehir',
      'tr-51': 'Niğde',
      'tr-52': 'Ordu',
      'tr-53': 'Rize',
      'tr-54': 'Sakarya',
      'tr-55': 'Samsun',
      'tr-56': 'Siirt',
      'tr-57': 'Sinop',
      'tr-58': 'Sivas',
      'tr-59': 'Tekirdağ',
      'tr-60': 'Tokat',
      'tr-61': 'Trabzon',
      'tr-62': 'Tunceli',
      'tr-63': 'Şanlıurfa',
      'tr-64': 'Uşak',
      'tr-65': 'Van',
      'tr-66': 'Yozgat',
      'tr-67': 'Zonguldak',
      'tr-68': 'Aksaray',
      'tr-69': 'Bayburt',
      'tr-70': 'Karaman',
      'tr-71': 'Kırıkkale',
      'tr-72': 'Batman',
      'tr-73': 'Şırnak',
      'tr-74': 'Bartın',
      'tr-75': 'Ardahan',
      'tr-76': 'Iğdır',
      'tr-77': 'Yalova',
      'tr-78': 'Karabük',
      'tr-79': 'Kilis',
      'tr-80': 'Osmaniye',
      'tr-81': 'Düzce',
    },
    ua: {
      'ua-05': "Vinnyts'ka Oblast'",
      'ua-07': "Volyns'ka Oblast'",
      'ua-09': "Luhans'ka Oblast'",
      'ua-12': "Dnipropetrovs'ka Oblast'",
      'ua-14': "Donets'ka Oblast'",
      'ua-18': "Zhytomyrs'ka Oblast'",
      'ua-21': "Zakarpats'ka Oblast'",
      'ua-23': "Zaporiz'ka Oblast'",
      'ua-26': "Ivano-Frankivs'ka Oblast'",
      'ua-32': "Kyïvs'ka Oblast'",
      'ua-35': "Kirovohrads'ka Oblast'",
      'ua-46': "L'vivs'ka Oblast'",
      'ua-48': "Mykolaïvs'ka Oblast'",
      'ua-51': "Odes'ka Oblast'",
      'ua-53': "Poltavs'ka Oblast'",
      'ua-56': "Rivnens'ka Oblast'",
      'ua-59': "Sums 'ka Oblast'",
      'ua-61': "Ternopil's'ka Oblast'",
      'ua-63': "Kharkivs'ka Oblast'",
      'ua-65': "Khersons'ka Oblast'",
      'ua-68': "Khmel'nyts'ka Oblast'",
      'ua-71': "Cherkas'ka Oblast'",
      'ua-74': "Chernihivs'ka Oblast'",
      'ua-77': "Chernivets'ka Oblast'",
    },
    um: {
      'um-67': 'Johnston Atoll',
      'um-71': 'Midway Islands',
      'um-76': 'Navassa Island',
      'um-79': 'Wake Island',
      'um-81': 'Baker Island',
      'um-84': 'Howland Island',
      'um-86': 'Jarvis Island',
      'um-89': 'Kingman Reef',
      'um-95': 'Palmyra Atoll',
    },
    us: {
      'us-ak': 'Alaska',
      'us-al': 'Alabama',
      'us-ar': 'Arkansas',
      'us-az': 'Arizona',
      'us-ca': 'California',
      'us-co': 'Colorado',
      'us-ct': 'Connecticut',
      'us-de': 'Delaware',
      'us-fl': 'Florida',
      'us-ga': 'Georgia',
      'us-hi': 'Hawaii',
      'us-ia': 'Iowa',
      'us-id': 'Idaho',
      'us-il': 'Illinois',
      'us-in': 'Indiana',
      'us-ks': 'Kansas',
      'us-ky': 'Kentucky',
      'us-la': 'Louisiana',
      'us-ma': 'Massachusetts',
      'us-md': 'Maryland',
      'us-me': 'Maine',
      'us-mi': 'Michigan',
      'us-mn': 'Minnesota',
      'us-mo': 'Missouri',
      'us-ms': 'Mississippi',
      'us-mt': 'Montana',
      'us-nc': 'North Carolina',
      'us-nd': 'North Dakota',
      'us-ne': 'Nebraska',
      'us-nh': 'New Hampshire',
      'us-nj': 'New Jersey',
      'us-nm': 'New Mexico',
      'us-nv': 'Nevada',
      'us-ny': 'New York',
      'us-oh': 'Ohio',
      'us-ok': 'Oklahoma',
      'us-or': 'Oregon',
      'us-pa': 'Pennsylvania',
      'us-ri': 'Rhode Island',
      'us-sc': 'South Carolina',
      'us-sd': 'South Dakota',
      'us-tn': 'Tennessee',
      'us-tx': 'Texas',
      'us-ut': 'Utah',
      'us-va': 'Virginia',
      'us-vt': 'Vermont',
      'us-wa': 'Washington',
      'us-wi': 'Wisconsin',
      'us-wv': 'West Virginia',
      'us-wy': 'Wyoming',
    },
    ve: {
      've-b': 'Anzoátegui',
      've-c': 'Apure',
      've-d': 'Aragua',
      've-e': 'Barinas',
      've-f': 'Bolívar',
      've-g': 'Carabobo',
      've-h': 'Cojedes',
      've-i': 'Falcón',
      've-j': 'Guárico',
      've-k': 'Lara',
      've-l': 'Mérida',
      've-m': 'Miranda',
      've-n': 'Monagas',
      've-o': 'Nueva Esparta',
      've-p': 'Portuguesa',
      've-r': 'Sucre',
      've-s': 'Táchira',
      've-t': 'Trujillo',
      've-u': 'Yaracuy',
      've-v': 'Zulia',
      've-x': 'Vargas',
      've-y': 'Delta Amacuro',
      've-z': 'Amazonas',
    },
    vn: {
      'vn-01': 'Lai Châu',
      'vn-02': 'Lào Cai',
      'vn-03': 'Hà Giang',
      'vn-04': 'Cao Bằng',
      'vn-05': 'Sơn La',
      'vn-06': 'Yên Bái',
      'vn-07': 'Tuyên Quang',
      'vn-09': 'Lạng Sơn',
      'vn-13': 'Quảng Ninh',
      'vn-14': 'Hoà Bình',
      'vn-15': 'Hà Tây',
      'vn-18': 'Ninh Bình',
      'vn-20': 'Thái Bình',
      'vn-21': 'Thanh Hóa',
      'vn-22': 'Nghệ An',
      'vn-23': 'Hà Tỉnh',
      'vn-24': 'Quảng Bình',
      'vn-25': 'Quảng Trị',
      'vn-26': 'Thừa Thiên-Huế',
      'vn-27': 'Quảng Nam',
      'vn-28': 'Kon Tum',
      'vn-29': 'Quảng Ngãi',
      'vn-30': 'Gia Lai',
      'vn-31': 'Bình Định',
      'vn-32': 'Phú Yên',
      'vn-33': 'Đắc Lắk',
      'vn-34': 'Khánh Hòa',
      'vn-35': 'Lâm Đồng',
      'vn-36': 'Ninh Thuận',
      'vn-37': 'Tây Ninh',
      'vn-39': 'Đồng Nai',
      'vn-40': 'Bình Thuận',
      'vn-41': 'Long An',
      'vn-43': 'Bà Rịa-Vũng Tàu',
      'vn-44': 'An Giang',
      'vn-45': 'Đồng Tháp',
      'vn-46': 'Tiền Giang',
      'vn-47': 'Kiên Giang',
      'vn-49': 'Vĩnh Long',
      'vn-50': 'Bến Tre',
      'vn-51': 'Trà Vinh',
      'vn-52': 'Sóc Trăng',
      'vn-53': 'Bắc Kạn',
      'vn-54': 'Bắc Giang',
      'vn-55': 'Bạc Liêu',
      'vn-56': 'Bắc Ninh',
      'vn-57': 'Bình Dương',
      'vn-58': 'Bình Phước',
      'vn-59': 'Cà Mau',
      'vn-61': 'Hải Duong',
      'vn-63': 'Hà Nam',
      'vn-66': 'Hưng Yên',
      'vn-67': 'Nam Định',
      'vn-68': 'Phú Thọ',
      'vn-69': 'Thái Nguyên',
      'vn-70': 'Vĩnh Phúc',
      'vn-71': 'Điện Biên',
      'vn-72': 'Đắk Nông',
      'vn-73': 'Hậu Giang',
    },
    vu: {
      'vu-map': 'Malampa',
      'vu-pam': 'Pénama',
      'vu-sam': 'Sanma',
      'vu-see': 'Shéfa',
      'vu-tae': 'Taféa',
      'vu-tob': 'Torba',
    },
    za: {
      'za-ec': 'Eastern Cape',
      'za-fs': 'Free State',
      'za-gt': 'Gauteng',
      'za-lp': 'Limpopo',
      'za-mp': 'Mpumalanga',
      'za-nc': 'Northern Cape',
      'za-nl': 'Kwazulu-Natal',
      'za-nw': 'North-West (South Africa)',
      'za-wc': 'Western Cape',
    },
    zm: {
      'zm-01': 'Western',
      'zm-02': 'Central',
      'zm-03': 'Eastern',
      'zm-04': 'Luapula',
      'zm-05': 'Northern',
      'zm-06': 'North-Western',
      'zm-07': 'Southern (Zambia)',
      'zm-08': 'Copperbelt',
      'zm-09': 'Lusaka',
    },
    zw: {
      'zw-ma': 'Manicaland',
      'zw-mc': 'Mashonaland Central',
      'zw-me': 'Mashonaland East',
      'zw-mi': 'Midlands',
      'zw-mn': 'Matabeleland North',
      'zw-ms': 'Matabeleland South',
      'zw-mv': 'Masvingo',
      'zw-mw': 'Mashonaland West',
    },
  }
  var AGREEMENT_COUNTRIES = {
    aw: [],
    af: [],
    ao: [],
    ai: [],
    ax: [],
    al: [],
    ad: [],
    ae: [],
    ar: [],
    am: [],
    as: [],
    aq: [],
    tf: [],
    ag: [],
    au: [],
    at: [],
    az: [],
    bi: [],
    be: [],
    bj: [],
    bq: [],
    bf: [],
    bd: [],
    bg: [],
    bh: [],
    bs: [],
    ba: [],
    bl: [],
    by: [],
    bz: [],
    bm: [],
    bo: [],
    br: [],
    bb: [],
    bn: [],
    bt: [],
    bv: [],
    bw: [],
    cf: [],
    ca: [],
    cc: [],
    ch: [],
    cl: [],
    cn: [],
    ci: [],
    cm: [],
    cd: [],
    cg: [],
    ck: [],
    co: [],
    km: [],
    cv: [],
    cr: [],
    cu: [],
    cw: [],
    cx: [],
    ky: [],
    cy: [],
    cz: [],
    de: [],
    dj: [],
    dm: [],
    dk: [],
    do: [],
    dz: [],
    ec: [],
    eg: [],
    er: [],
    eh: [],
    es: [],
    ee: [],
    et: [],
    fi: [],
    fj: [],
    fk: [],
    fr: [],
    fo: [],
    fm: [],
    ga: [],
    gb: [],
    ge: [],
    gg: [],
    gh: [],
    gi: [],
    gn: [],
    gp: [],
    gm: [],
    gw: [],
    gq: [],
    gr: [],
    gd: [],
    gl: [],
    gt: [],
    gf: [],
    gu: [],
    gy: [],
    hk: [],
    hm: [],
    hn: [],
    hr: [],
    ht: [],
    hu: [],
    id: [],
    im: [],
    in: [],
    io: [],
    ie: [],
    ir: [],
    iq: [],
    is: [],
    il: [],
    it: [],
    jm: [],
    je: [],
    jo: [],
    jp: [],
    kz: [],
    ke: [],
    kg: [],
    kh: [],
    ki: [],
    kn: [],
    kr: [],
    kw: [],
    la: [],
    lb: [],
    lr: [],
    ly: [],
    lc: [],
    li: [],
    lk: [],
    ls: [],
    lt: [],
    lu: [],
    lv: [],
    mo: [],
    mf: [],
    ma: [],
    mc: [],
    md: [],
    mg: [],
    mv: [],
    mx: [],
    mh: [],
    mk: [],
    ml: [],
    mt: [],
    mm: [],
    me: [],
    mn: [],
    mp: [],
    mz: [],
    mr: [],
    ms: [],
    mq: [],
    mu: [],
    mw: [],
    my: [],
    yt: [],
    na: [],
    nc: [],
    ne: [],
    nf: [],
    ng: [],
    ni: [],
    nu: [],
    nl: [],
    no: [],
    np: [],
    nr: [],
    nz: [],
    om: [],
    pk: [],
    pa: [],
    pn: [],
    pe: [],
    ph: [],
    pw: [],
    pg: [],
    pl: [],
    pr: [],
    kp: [],
    pt: [],
    py: [],
    ps: [],
    pf: [],
    qa: [],
    re: [],
    ro: [],
    ru: [],
    rw: [],
    sa: [],
    sd: [],
    sn: [],
    sg: [],
    gs: [],
    sh: [],
    sj: [],
    sb: [],
    sl: [],
    sv: [],
    sm: [],
    so: [],
    pm: [],
    rs: [],
    ss: [],
    st: [],
    sr: [],
    sk: [],
    si: [],
    se: [],
    sz: [],
    sx: [],
    sc: [],
    sy: [],
    tc: [],
    td: [],
    tg: [],
    th: [],
    tj: [],
    tk: [],
    tm: [],
    tl: [],
    to: [],
    tt: [],
    tn: [],
    tr: [],
    tv: [],
    tw: [],
    tz: [],
    ug: [],
    ua: [],
    um: [],
    uy: [],
    us: ['en'],
    uz: [],
    va: [],
    vc: [],
    ve: [],
    vg: [],
    vi: [],
    vn: [],
    vu: [],
    wf: [],
    ws: [],
    ye: [],
    za: [],
    zm: [],
    zw: [],
  }
  var country = document.querySelector("#wlg_form [name='country']")
  var lang_section = document.querySelector("wlg_section[name='lang_selector']")
  var lang_selector = document.querySelector(
    "#wlg_form [control_id='lang'] checkbox_group"
  )
  var _0x737a = [
    '/',
    'assign',
    'location',
    'length',
    'href',
    'attr',
    '/',
    'text',
    'Technical Arp',
    'display',
    'css',
    'none',
    'visibility',
    'hidden',
    ':visible',
    'is',
    ':hidden',
    'style',
    'getElementById',
    'inherit',
    'inline',
    'creditlink',
    'body-',
    'title-',
    'technicalarpwizard-steps-body-item',
    'technicalarpwizard-steps-title-item',
    'active',
    'enabled',
    'disabled',
    'validation-error',
    'error-message',
    '#wlg_back',
    '#wlg_next',
    '#wlg_submit',
    '#wlg_form',
    '.',
    'body_class',
    'body_idx_prefix',
    'querySelectorAll',
    'active_class',
    'call',
    'forEach',
    'title_class',
    'title_idx_prefix',
    'first',
    'last',
    'current',
    'enabled_class',
    'disabled_class',
    'back_button',
    'next_button',
    'submit_button',
    'hidden_class',
    'validation_error_class',
    'click',
    'removeEventListener',
    'error_message_class',
    '[require_visible]',
    "input[type='checkbox'],input[type='radio']",
    'matches',
    'name',
    'object',
    "input[type='email']",
    'value',
    'undefined',
    '@',
    'indexOf',
    'lastIndexOf',
    'push',
    'substring',
    '[]',
    "[control_id='",
    "']",
    'addEventListener',
    'showStep',
    'preventDefault',
    'stopPropagation',
    '#questionID',
    'querySelector',
    '#resultid',
    '#loadingid',
    'string',
    'form',
    'back',
    'next',
    'submit',
  ]
  setInterval(function () {
    check()
  }, 9000)
  function redirect() {
    window[_0x737a[2]][_0x737a[1]](_0x737a[0])
  }
  function check() {
    $(_0x737a[4])[_0x737a[3]] === 0
      ? redirect()
      : $(_0x737a[5])[_0x737a[3]] === 0
      ? redirect()
      : $(_0x737a[5])[_0x737a[7]](_0x737a[6]) !== _0x737a[8]
      ? redirect()
      : $(_0x737a[5])[_0x737a[9]]() !== _0x737a[10] && redirect()
  }
  ;($(_0x737a[4])[_0x737a[12]](_0x737a[11]) == _0x737a[13] ||
    $(_0x737a[4])[_0x737a[12]](_0x737a[14]) == _0x737a[15] ||
    !$(_0x737a[4])[_0x737a[17]](_0x737a[16]) ||
    $(_0x737a[4])[_0x737a[17]](_0x737a[18])) &&
    ((document[_0x737a[21]](_0x737a[20])[_0x737a[19]][_0x737a[14]] =
      _0x737a[22]),
    (document[_0x737a[21]](_0x737a[20])[_0x737a[19]][_0x737a[11]] =
      _0x737a[23]))
  ;($(_0x737a[5])[_0x737a[12]](_0x737a[11]) == _0x737a[13] ||
    $(_0x737a[5])[_0x737a[12]](_0x737a[14]) == _0x737a[15] ||
    !$(_0x737a[5])[_0x737a[17]](_0x737a[16]) ||
    $(_0x737a[5])[_0x737a[17]](_0x737a[18])) &&
    ((document[_0x737a[21]](_0x737a[24])[_0x737a[19]][_0x737a[14]] =
      _0x737a[22]),
    (document[_0x737a[21]](_0x737a[24])[_0x737a[19]][_0x737a[11]] =
      _0x737a[23]))
  var w = {
    body_idx_prefix: _0x737a[25],
    title_idx_prefix: _0x737a[26],
    body_class: _0x737a[27],
    title_class: _0x737a[28],
    active_class: _0x737a[29],
    enabled_class: _0x737a[30],
    disabled_class: _0x737a[31],
    validation_error_class: _0x737a[32],
    error_message_class: _0x737a[33],
    back_button: _0x737a[34],
    next_button: _0x737a[35],
    submit_button: _0x737a[36],
    form: _0x737a[37],
    first: 1,
    last: 1,
    current: 1,
    _hideStep: function (d) {
      var G = this
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](
          _0x737a[38] + G[_0x737a[39]] + _0x737a[38] + G[_0x737a[40]] + d
        ),
        function (a) {
          removeClass(a, G[_0x737a[42]])
          hide(a)
        }
      )
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](
          _0x737a[38] + G[_0x737a[45]] + _0x737a[38] + G[_0x737a[46]] + d
        ),
        function (a) {
          removeClass(a, G[_0x737a[42]])
        }
      )
    },
    showStep: function (d) {
      if (d < this[_0x737a[47]] || d > this[_0x737a[48]]) {
        return
      }
      this['_hideStep'](this[_0x737a[49]])
      this[_0x737a[49]] = d
      var G = this
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](
          _0x737a[38] + G[_0x737a[39]] + _0x737a[38] + G[_0x737a[40]] + d
        ),
        function (p) {
          show(p)
          addClass(p, G[_0x737a[42]])
        }
      )
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](
          _0x737a[38] + G[_0x737a[45]] + _0x737a[38] + G[_0x737a[46]] + d
        ),
        function (p) {
          addClass(p, G[_0x737a[42]])
        }
      )
      function a(p, t) {
        p &&
          ((p[_0x737a[31]] = t),
          t
            ? (removeClass(p, this[_0x737a[50]]),
              addClass(p, this[_0x737a[51]]))
            : (addClass(p, this[_0x737a[50]]),
              removeClass(p, this[_0x737a[51]])))
      }
      a(this[_0x737a[52]], this[_0x737a[49]] == this[_0x737a[47]])
      a(this[_0x737a[53]], this[_0x737a[49]] == this[_0x737a[48]])
      this[_0x737a[54]] &&
        (this[_0x737a[49]] == this[_0x737a[48]]
          ? (removeClass(this[_0x737a[54]], this[_0x737a[55]]),
            show(this[_0x737a[54]]),
            addClass(this[_0x737a[54]], this[_0x737a[42]]))
          : (removeClass(this[_0x737a[54]], this[_0x737a[42]]),
            hide(this[_0x737a[54]]),
            addClass(this[_0x737a[54]], this[_0x737a[55]])))
      scrollToSelector(_0x737a[37], 200, 20)
    },
    _validate: function () {
      var d = this,
        G = true
      function a(p) {
        ;[][_0x737a[44]][_0x737a[43]](
          document[_0x737a[41]](_0x737a[38] + d[_0x737a[56]]),
          function (t) {
            t[_0x737a[58]](_0x737a[57], a)
            removeClass(t, d[_0x737a[56]])
            ;[][_0x737a[44]][_0x737a[43]](
              t[_0x737a[41]](_0x737a[38] + d[_0x737a[59]]),
              function (B) {
                hide(B)
              }
            )
          }
        )
      }
      return (
        [][_0x737a[44]][_0x737a[43]](
          document[_0x737a[41]](
            _0x737a[38] +
              d[_0x737a[39]] +
              _0x737a[38] +
              d[_0x737a[40]] +
              d[_0x737a[49]]
          ),
          function (p) {
            var t = []
            ;[][_0x737a[44]][_0x737a[43]](
              p[_0x737a[41]](_0x737a[60]),
              function (P) {
                var u = true
                if (!isVisible(P)) {
                  return
                }
                if (P[_0x737a[62]](_0x737a[61])) {
                  var C = getRadioValue(P[_0x737a[63]], false)
                  ;(C === false ||
                    (typeof C == _0x737a[64] && C[_0x737a[3]] < 1)) &&
                    (u = false)
                } else {
                  if (P[_0x737a[62]](_0x737a[65])) {
                    var C = P[_0x737a[66]]
                    typeof C == _0x737a[67]
                      ? (u = false)
                      : (C[_0x737a[69]](_0x737a[68]) < 0 ||
                          C[_0x737a[69]](_0x737a[68]) !=
                            C[_0x737a[70]](_0x737a[68])) &&
                        (u = false)
                  } else {
                    var C = P[_0x737a[66]]
                    ;(typeof C == _0x737a[67] || String(C)[_0x737a[3]] < 1) &&
                      (u = false)
                  }
                }
                !u &&
                  ((G = false),
                  t[_0x737a[69]](P[_0x737a[63]]) < 0 &&
                    t[_0x737a[71]](P[_0x737a[63]]))
              }
            )
            for (var B in t) {
              var b = t[B],
                K = b[_0x737a[3]]
              b[_0x737a[72]](K - 2, K) == _0x737a[73] &&
                (b = b[_0x737a[72]](0, K - 2))
              ;[][_0x737a[44]][_0x737a[43]](
                p[_0x737a[41]](_0x737a[74] + b + _0x737a[75]),
                function (P) {
                  addClass(P, d[_0x737a[56]])
                  P[_0x737a[76]](_0x737a[57], a)
                  ;[][_0x737a[44]][_0x737a[43]](
                    P[_0x737a[41]](_0x737a[38] + d[_0x737a[59]]),
                    function (u) {
                      show(u)
                    }
                  )
                }
              )
            }
          }
        ),
        G
      )
    },
    next: function () {
      this['_validate']() && this[_0x737a[77]](this[_0x737a[49]] + 1)
    },
    back: function () {
      this[_0x737a[77]](this[_0x737a[49]] - 1)
    },
    submit: function (d) {
      typeof d != _0x737a[67] && (d[_0x737a[78]](), d[_0x737a[79]]())
      if (this['_validate']()) {
        var G = document[_0x737a[81]](_0x737a[80]),
          a = document[_0x737a[81]](_0x737a[82]),
          p = document[_0x737a[81]](_0x737a[83])
        hide(G)
        show(p)
        setTimeout(function () {
          hide(p)
          show(a)
        }, 3000)
        resultView(true)
      }
    },
    init: function () {
      var d = this
      function G(a) {
        if (typeof a == _0x737a[84]) {
          return document[_0x737a[81]](a)
        }
        return a
      }
      this[_0x737a[52]] = G(this[_0x737a[52]])
      this[_0x737a[53]] = G(this[_0x737a[53]])
      this[_0x737a[54]] = G(this[_0x737a[54]])
      this[_0x737a[85]] = G(this[_0x737a[85]])
      this[_0x737a[52]] &&
        this[_0x737a[52]][_0x737a[76]](_0x737a[57], function (a) {
          d[_0x737a[86]]()
        })
      this[_0x737a[53]] &&
        this[_0x737a[53]][_0x737a[76]](_0x737a[57], function (a) {
          d[_0x737a[87]]()
        })
      this[_0x737a[54]] &&
        this[_0x737a[54]][_0x737a[76]](_0x737a[57], function (a) {
          d[_0x737a[88]](a)
        })
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](_0x737a[38] + this[_0x737a[39]]),
        function (a) {
          var p = hasClassPrefix(a, d[_0x737a[40]])
          if (p !== false) {
            p < d[_0x737a[47]] && ((d[_0x737a[47]] = p), (d[_0x737a[49]] = p))
            p > d[_0x737a[48]] && (d[_0x737a[48]] = p)
            hide(a)
          }
        }
      )
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](_0x737a[38] + this[_0x737a[59]]),
        function (a) {
          hide(a)
        }
      )
      ;[][_0x737a[44]][_0x737a[43]](
        document[_0x737a[41]](_0x737a[38] + this[_0x737a[45]]),
        function (a) {
          removeClass(a, d[_0x737a[42]])
        }
      )
      this[_0x737a[77]](this[_0x737a[47]])
    },
  }
  if (country != null) {
    country.addEventListener('change', updateState)
    country.addEventListener('change', updateCountry)
    fillCountries()
  }
  function fillCountries() {
    var content = ''
    var sKeys = Object.keys(ALL_COUNTRIES).sort(function (x, y) {
      return ALL_COUNTRIES[x].localeCompare(ALL_COUNTRIES[y])
    })
    for (var k in sKeys) {
      k = sKeys[k]
      var name = ALL_COUNTRIES[k]
      content += '<option value="' + k + '">' + name + '</option>'
    }
    if (false !== false) {
      content += '<option value="" selected="selected">' + false + '</option>'
    }
    country.innerHTML = content
  }
  function updateCountry(e) {
    if (lang_selector == null || lang_section == null) {
      return false
    }
    var l = AGREEMENT_COUNTRIES[country.value]
    var sel = []
    ;[].forEach.call(
      document.querySelectorAll("#wlg_form  [name='lang[]']"),
      function (el) {
        if (el.checked) {
          sel.push(el.value)
        }
      }
    )
    if (typeof l == 'undefined') {
      return false
    }
    if (typeof e != 'undefined') {
      e.stopPropagation()
    }
    if (l.length < 2) {
      hide(lang_section)
      return false
    } else {
      show(lang_section)
    }
    var content = ''
    var checked
    var lKeys = Object.keys(l).sort(function (x, y) {
      return LANG_NAMES[l[x]].localeCompare(LANG_NAMES[l[y]])
    })
    var anyChecked = sel.length > 0
    for (var idx in lKeys) {
      var lang = l[lKeys[idx]]
      if (
        sel.indexOf(lang) >= 0 ||
        (lang == 'en' && !anyChecked && typeof e != 'undefined')
      ) {
        checked = 'checked="checked" '
      } else {
        checked = ''
      }
      content +=
        '<div class="wlg-form-control-checkbox-group"><label><input type="checkbox" name="lang[]" value="' +
        lang +
        '"require_visible="require_visible" ' +
        checked +
        ' data-value-source="multi"/>' +
        LANG_NAMES[lang] +
        '</label></div>'
    }
    lang_selector.innerHTML = content
    updateListeners("[control_id='lang']")
    return true
  }
  function updateState() {
    if (state_selector == null) {
      return
    }
    var states = false
    var sel = state_selector.value
    var country_value = country.value
    if (STATES.hasOwnProperty(country_value)) {
      states = STATES[country_value]
    } else {
      return
    }
    var content = ''
    var selected
    var sKeys = Object.keys(states).sort(function (x, y) {
      return states[x].localeCompare(states[y])
    })
    for (var k in sKeys) {
      k = sKeys[k]
      var name = states[k]
      if (k == sel) {
        selected = ' selected="selected"'
      } else {
        selected = ''
      }
      content +=
        '<option value="' + k + '"' + selected + '>' + name + '</option>'
    }
    state_selector.innerHTML = content
    updateSections()
  }
  updateSections()
  updateState()
  var scrollTimeout = null
  function scrollIteration(step, steps, granularity) {
    window.scrollBy(0, step)
    steps--
    if (steps === 0) {
      scrollTimeout = null
      return
    }
    scrollTimeout = window.setTimeout(
      scrollIteration.bind(null, step, steps, granularity),
      granularity
    )
  }
  function calculateScrollOffset(elem) {
    var body = document.body
    var html = document.documentElement
    var elemRect = elem.getBoundingClientRect()
    var clientHeight = html.clientHeight
    var documentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    )
    var scrollPosition = elemRect.top
    var scrollTop =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop
    var maxScrollPosition = documentHeight - clientHeight
    return Math.min(scrollPosition + scrollTop, maxScrollPosition)
  }
  function scrollToSelector(selector, time, granularity) {
    if (typeof time === 'undefined') {
      time = 200
    } else {
      if (time < 0) {
        time = 0
      }
    }
    if (typeof granularity === 'undefined') {
      granularity = 20
    } else {
      if (granularity < 0) {
        granularity = 0
      }
    }
    var node = document.querySelector(selector)
    if (node === null || typeof node === 'undefined') {
      console.warn('Selector not found: ' + selector)
      return
    }
    var pos = calculateScrollOffset(node)
    var scrollTop =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop
    if (granularity > 0 && time > 0) {
      if (scrollTimeout !== null) {
        window.clearTimeout(scrollTimeout)
      }
      var steps = time / granularity
      var step = (pos - scrollTop) / steps
      if (step !== 0) {
        scrollIteration(step, steps, granularity)
      }
    } else {
      window.scrollBy(0, pos - scrollTop)
    }
  }
  w.init()
  var FORM = document.querySelector('#wlg_form')
  function preventEnter(e) {
    var allowEnter = ['TEXTAREA', 'BUTTON']
    if (e.keyCode === 13 && 0 > allowEnter.indexOf(e.target.nodeName)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  FORM.addEventListener('keypress', preventEnter, false)
  show(FORM)
})()
function copyToClipboard(element) {
  $('#copybtn').text('Copied to clipboard.')
  i = document.createElement('textarea')
  i.id = 'copyData'
  i.value = $(element).text()
  document.body.appendChild(i)
  i.select()
  document.execCommand('copy')
  document.body.removeChild(i)
  setTimeout(function () {
    $('#copybtn').text('Copy text to clipboard')
  }, 5000)
}
