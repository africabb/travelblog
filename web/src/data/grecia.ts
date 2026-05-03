export interface GreciaReference {
  name: string;
  mapsQuery?: string;
  mapsUrl?: string;
  officialUrl?: string;
}

export type GreciaReferenceInput = GreciaReference | string;

export interface GreciaSummaryGroup {
  place: GreciaReferenceInput;
  restaurants?: GreciaReferenceInput[];
  places?: GreciaReferenceInput[];
}

export interface GreciaChapter {
  num: number;
  title: string;
  date: string | null;
  restaurants: GreciaReferenceInput[];
  places: GreciaReferenceInput[];
  summaryGroups?: GreciaSummaryGroup[];
  text: string;
  images: string[];
}

const ref = (
  name: string,
  mapsQuery = name,
  officialUrl?: string,
  mapsUrl?: string,
): GreciaReference => ({ name, mapsQuery, officialUrl, mapsUrl });

const googleMapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const placeRef = (name: string, mapsQuery = name): GreciaReference =>
  ref(name, mapsQuery, undefined, googleMapsSearch(mapsQuery));

export const GRECIA_CHAPTERS: GreciaChapter[] = [
  {
    num: 1,
    title: 'Dando forma a los óniros',
    date: null,
    restaurants: [],
    places: [
      ref('Palma de Mallorca'),
      'Mar Jónico',
      ref('Meganisi'),
      ref('Lefkada'),
      ref('Kefalonia'),
      ref('Ithaka'),
      ref('Paxos'),
      ref('Mr. Bojangles'),
    ],
    summaryGroups: [
      {
        place: ref('Islas Jónicas'),
        places: [
          placeRef('Meganisi', 'Meganisi Greece'),
          placeRef('Lefkada', 'Lefkada Greece'),
          placeRef('Kefalonia', 'Kefalonia Greece'),
          placeRef('Ithaka', 'Ithaca Greece'),
          placeRef('Paxos', 'Paxos Greece'),
        ],
      },
    ],
    text: `Una fría tarde de invierno, dos almas con hambre de vivir y de pasar tiempo una al lado de la otra, empezaron a soñar despiertas. Entre sus sueños siempre estaba presente experimentar la locura de lo desconocido y la paz que te brinda la libertad. Eran dos premisas innegociables en las que se fundamentaba su "nube", término usado para simbolizar su ideal de estilo de vida, el cual encajaba con sus espíritus indomables.

Para ellos los sueños no eran más que planes sin ejecutar, se creían capaces de conseguir todos, ya que solo había que trazar el plan y ponerse en marcha. Las locuras no eran más que retos, y los sueños futuras realidades, que sabían que eventualmente cogerían forma. Sin mucho más pensar, aterrizaron la idea de navegar a vela por algún rincón del Mediterráneo en verano. Finalmente, decidieron embarcarse en la exploración de las islas griegas. Después de investigar, decidieron alquilar un velero por el mar Jónico, ya que tiene unas condiciones de navegación favorables. Es un mar protegido del viento ya que sus diversas islas se encuentran cercanas entre ellas y el clima es ideal durante el verano. Isla en griego se dice "Nisos". Este mar tiene muchas islas que poseen una belleza única, entre las cuales se encuentran Meganisi, Lefkada, Kefalonia, Ithaka, Paxos.

Tras mirar opciones de barcos, puertos y precios, finalmente plasmaron sus ojos en Mr. Bojangles, un Bavaria de 38 pies. En las fotos lucía muy bien por lo que esta embarcación fue la elegida. Tras escribir al armador, fijaron la reserva por 12 días. ¡Todo empezaba a coger forma! Andreas, el armador griego en cuestión, tras hacer la reserva les mandó un itinerario de ruta a seguir. Como buenas almas libres, no les preocupaba mucho no tener un plan establecido y concreto. Prefirieron no mirar mucho la ruta, ni fotos de los lugares a los que iban a ir para que cuando llegaran, estuviera presente el factor sorpresa que tanto les daba vida. Les gustaba ir sobre la marcha, sin prisas, explorando al ritmo natural de la calma. Con mucha paz, sin mucha expectativa y con los ojos y la mente bien abierta. ¿Sabes lo que es la ataraxia? La ataraxia es un término que proviene de la filosofía griega antigua y se refiere a un estado de serenidad y tranquilidad, una ausencia de perturbaciones o preocupaciones, la consecuencia natural de vivir en armonía y de mantener la indiferencia ante los eventos externos y fuera de control. Pues así intentaban ser, y lo lograban a través búsqueda de placeres simples y naturales.

Si te preguntabas al leer el título del capítulo, ¿Qué serán los óniros? Ahora podrás intuir que se trata de los sueños en el sentido de metas o aspiraciones. La palabra griega sería «όνειρο ζωής» (óniro zoís), que literalmente significa «sueño de vida».`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0001-3045918172-e1689257774541-edited.jpg',
    ],
  },
  {
    num: 2,
    title: 'La llegada a Grecia',
    date: '7 Julio 2023',
    restaurants: [
      ref('Lampadina Traditional Cuisine', 'Lampadina Traditional Cuisine Corfu', 'https://www.instagram.com/lampadinacorfu/', 'https://www.google.com/maps/search/?api=1&query=Lampadina%20Traditional%20Cuisine%2C%20Gerasimou%20Prifti%2019%2C%20Corfu%20Town%2049100%20Greece'),
      ref('Corfú Beer', 'Corfu Beer Greece', 'https://corfubeer.com/en/', 'https://www.google.com/maps/search/?api=1&query=Corfu%20Beer%2C%20Arillas%2049081%2C%20Corfu%2C%20Greece'),
    ],
    places: [
      ref('Palma de Mallorca'),
      'Milán',
      'Corfú',
      'Centro histórico de Corfú',
      'Puerto de Corfú',
      'Airbnb de Corfú',
    ],
    summaryGroups: [
      {
        place: placeRef('Corfú', 'Corfu Greece'),
        restaurants: [
          ref('Lampadina Traditional Cuisine', 'Lampadina Traditional Cuisine Corfu', 'https://www.instagram.com/lampadinacorfu/', 'https://www.google.com/maps/search/?api=1&query=Lampadina%20Traditional%20Cuisine%2C%20Gerasimou%20Prifti%2019%2C%20Corfu%20Town%2049100%20Greece'),
          ref('Corfú Beer', 'Corfu Beer Greece', 'https://corfubeer.com/en/', 'https://www.google.com/maps/search/?api=1&query=Corfu%20Beer%2C%20Arillas%2049081%2C%20Corfu%2C%20Greece'),
        ],
        places: [
          placeRef('Corfú', 'Corfu Greece'),
          placeRef('Centro histórico de Corfú', 'Old Town Corfu Greece'),
          placeRef('Puerto de Corfú', 'Corfu Port Greece'),
        ],
      },
    ],
    text: `Hacia Mr. B

7. Julio. 2023

Salida desde otro bellísimo lugar del Mediterráneo, Palma de Mallorca (España) hacia Corfú (Grecia) con escala en Milán (Italia). Tras 12 horas en aeropuertos, desde las 10 de la mañana que salieron hasta las 10 de la noche que llegaron a Corfú, las almas, cansadas pero felices finamente llegaron a su destino con las mochilas a cuestas (cogieron sólo equipaje de mano, como buenos nómadas desprovistos de exceso de ropa y desapegados de pertenencias innecesarias. En cambio, no podían desatender su único apego existente, el ordenador). Ya en el autobús que les llevaba desde el aeroupuerto al centro de la ciudad, llamaron para reservar en una "Taverna" griega llamada "Lampadina Traditional Cuisine". El cansancio era proporcional al hambre, y la ilusión por probar la comida griega estaba muy presente. Pidieron de entrante unas "croquetas de calabacín" acompañadas de una especie de salsa denominada "Tzatziki" un dip de yogur griego, pepino y ajo. Mucho ajo. A los griegos parece que les gustan los sabores fuertes. También pidieron unas "anchovies en vinagre" (que no saben a día de hoy si son anchoas o boquerones, ya que su color tira más bien al blanco que al marrón). De segundo pidieron el plato estrella de Grecia, una "Mousakka", (parece una lasaña de berenjenas) y por último una carne con patatas en salsa, una vez más, con ajo y especias. Estaba todo muy rico y por tan sólo 20 euros por persona, quedaron más que satisfechos. Listos para finalizar el día y descansar. Ah, se me olvidaba. Brindaron con una cerveza, Premium Lager que no podía llamarse de otra forma que no fuera "Corfú Beer". Brindaron por ellos, y por todas las aventuras que tenían encima, pidiendo buena suerte en sus inminentes peripecias y por supuesto, que hubiera mucho amor y ataraxia. Luego, dieron un paseo de unos 15 minutos hasta llegar al Airbnb, por las calles decadentes de Corfú. Eran típicas calles antiguas de ciudad portuaria en las que las desgastadas fachadas de los edificios te dicen a gritos que el tiempo no transcurre y que la cultura y las tradiciones se mantienen intactas, conservando así la autenticidad del lugar. Tras una caminata por el puerto con olor a sal, llegaron al apartamento. En unos pocos minutos, la luz se apagó.`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9867.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9875.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9877.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9878.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9879.jpg',
    ],
  },
  {
    num: 3,
    title: 'De camino al lugar donde vive Mr. Bojangles',
    date: '8 Julio 2023',
    restaurants: [
      ref('The Windmill Taverna', 'The Windmill Taverna Paleros Greece', undefined, 'https://www.google.com/maps/search/?api=1&query=The%20Windmill%20Taverna%2C%20Paleros%2C%20Greece'),
      ref('Supermercado bajo el hotel Azzurro'),
    ],
    places: [
      'Corfú',
      'Ferry Corfú-Igoumenitsa',
      ref('Igoumenitsa'),
      ref('Hotel usado para conectarse al examen'),
      ref('Paleros'),
      ref('Hotel Azzurro'),
      ref('Puerto de Paleros'),
    ],
    summaryGroups: [
      {
        place: placeRef('Paleros', 'Paleros Greece'),
        restaurants: [
          ref('The Windmill Taverna', 'The Windmill Taverna Paleros Greece', undefined, 'https://www.google.com/maps/search/?api=1&query=The%20Windmill%20Taverna%2C%20Paleros%2C%20Greece'),
        ],
        places: [
          placeRef('Paleros', 'Paleros Greece'),
          placeRef('Puerto de Paleros', 'Paleros Port Greece'),
        ],
      },
    ],
    text: `Tras una larga noche de calor, y una mosquitera bastante inadecuada para las dimensiones del colchón, amaneció a las 7 de la mañana en Corfú. Les esperaba un largo día de camino a Paleros, con parada en Igoumenitsa, donde tenían que conectarse a Internet a las 13:00 (12 hora española) para hacer un examen durante dos horas. Después del examen un transfer les esperaría para coger carretera hacia Paleros. El primer paso era coger el ferrry de Corfú a Igoumenitsa, que salía a las 8 de la mañana. Fue un trayecto que se hizo bastante llevadero ya que las vistas eran muy bonitas (se pueden ver las fotos al final). Cuando llegaron a Igoumenitsa, ya tenían un hotel localizado el cual habían llamado la noche anterior para preguntar si podían usar su wifi durante la mañana. Los griegos no pusieron ningún problema, por lo que se instalaron en el lobby del hotel y el wifi funcionaba perfectamente. ¡Primera prueba superada! El examen fue genial y todo apuntaba a que el viaje iba a comenzar con muy buen pie. A los 10 minutos de terminar el examen, les recogió su taxi. En una hora y media de trayecto hasta Paleros, observaban el paisaje, montañoso y aparentemente sin mucha civilización.

Finalmente llegaron al destino a las 5 de la tarde. Paleros les pareció muy bonito, un pueblo en el que las casitas de piedra y las plantas en las terrazas desprendían un aire muy local y mediterráneo. El taxi les dejó en la misma puerta del hotel, llamado "Azzurro". Era un pequeño edificio de tres plantas. Al llegar, se dispusieron a la planta baja para hacer el check-in, dándose cuenta que estaban entrando en la casa del aparentemente dueño del hotel. Salió un hombre, y sin preguntar ni pedir documentación, nos dirigió a nuestro apartamento que estaba en la segunda planta. Así de rápido y sencillo. Por fin podían dejar las mochilas y deleitarse con una buena ducha. Había un supermercado justo debajo del hotel lo cual fue estupendo ya que tenían que hacer la compra para llevarla al barco. El abecedario griego es un rompecabezas. No entendían ni una letra y realmente no podían leer qué llevaba lo que estaban comprando, no obstante, la compra se realizó con éxito. Tras dejar la compra en el hotel, llegaron a cenar a un restaurante muy pintoresco que tenía muy buenas valoraciones en Trip Advisor. Se llamaba "The Windmill Taverna". ¡MUY RICO! El lugar era idílico. Era un restaurante familiar (como todos los de las islas) que parecía el patio de la casa de la dueña. Fueron los primeros en llegar, a las 7 de la tarde como buenos turistas hambrientos. El patio estaba aún vacío y pudieron percibir que la mujer que salió era la madre de un niño que estaba rondando todavía por el patio de su casa. La dueña fue muy amable y sonriente y nada más llegar les trajo una botella de agua bien fría sin preguntar, una costumbre que tienen los griegos. Les pareció muy auténtico que no había carta, era el menú que la señora había preparado y que dijo que iría sacando poco a poco hasta que le dijeran que estaban llenos. Aún no sabía qué buenos clientes acababan de llegar. La única pregunta que les hizo era si les gustaba el ajo, y cómo no, la respuesta fue afirmativa. Les sacaron de primer plato que constaba de 3 dips, el primero era el típico "Tzatziki", otro de remolacha con nueces y otro puré de patata con ajo. Después salieron unos triangulitos de hojaldre rellenos de queso con miel que estaban deliciosos. Luego trajeron unas gambas con salsa de vino blanco y ajos. De principales una Moussaka y otra carne "stifada" más buena que la del día anterior. Ah, y un vino casero ligerito de cosecha propia. Al pagar, la dueña muy agradecida les dio las gracias por haber probado todo su menú. Después cenar pasearon por el puerto en busca de su embarcación, aún no sabían el nombre y sólo podían adivinar cuál era por las fotos. El paseo por Paleros por la noche fue muy bonito, habían niños jugando al fútbol en la plaza y se respiraba mucha tranquilidad. La presencia de la inmensa montaña detrás del pueblo, creaba un ambiente de grandiosidad y daba mucha seguridad. Tras el paseo nocturno por las pequeñas tavernas del pueblo con parada para comprar crema solar en una mini tienda, regresaron al hotel para descansar. ¡El día siguiente sería el gran día del encuentro con su compañero de viaje!`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/captura-de-pantalla-2023-07-14-a-las-5.19.20-p.e280afm.png',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9892-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9905.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9908.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9913.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9915.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9917.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9920.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9924.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9925.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9926.jpg',
    ],
  },
  {
    num: 4,
    title: 'El encuentro con Mr. Bojangles',
    date: null,
    restaurants: [
      'Cafetería de la familia de Andreas en Paleros',
      ref('Taverna Spilia', 'Taverna Spilia Meganisi', undefined, 'https://www.google.com/maps/search/?api=1&query=Taverna%20Spilia%2C%20Roca%20Beach%2C%20Spartochori%2C%20Meganisi%2C%20Greece'),
    ],
    places: [
      ref('Paleros'),
      ref('Puerto de Paleros'),
      ref('Mr. Bojangles'),
      ref('Vathiavali Beach'),
      ref('Meganisi'),
      ref('Spartochori'),
      ref('Porto Spilia'),
      'Mar Jónico',
    ],
    summaryGroups: [
      {
        place: placeRef('Paleros', 'Paleros Greece'),
        restaurants: ['Cafetería de la familia de Andreas en Paleros'],
        places: [
          placeRef('Paleros', 'Paleros Greece'),
          placeRef('Puerto de Paleros', 'Paleros Port Greece'),
          placeRef('Vathiavali Beach', 'Vathiavali Beach Greece'),
        ],
      },
      {
        place: placeRef('Meganisi', 'Meganisi Greece'),
        restaurants: [ref('Taverna Spilia', 'Taverna Spilia Meganisi', undefined, 'https://www.google.com/maps/search/?api=1&query=Taverna%20Spilia%2C%20Roca%20Beach%2C%20Spartochori%2C%20Meganisi%2C%20Greece')],
        places: [
          placeRef('Meganisi', 'Meganisi Greece'),
          placeRef('Spartochori', 'Spartochori Meganisi Greece'),
          placeRef('Porto Spilia', 'Porto Spilia Meganisi Greece'),
        ],
      },
    ],
    text: `Amaneció en Paleros a las 8:30 de la mañana. El sol picaba ya fuerte y se podían escuchar las chicharras por la ventana. El dueño del barco, Andreas, les dijo que estuvieran en el puerto a las 9:30 de la mañana aunque más tarde escribió un mensaje diciendo que llegaran a las 11. Se hicieron las 11 y allá que fueron al puerto con las mochilas y las bolsas de la compra a cuestas. Se encontraron con Andreas y por fin se subieron al barco. ¡Primer encuentro con su querido Mr. Bojangles! Andreas era un chico joven, simpático y les guió por todo el barco enseñándoles donde estaba cada cosa asegurándose de que su barco se quedaba en buenas manos. Estaba preparado para 6 personas porque por alguna extraña razón Andreas se confundió. Mr. B estaba muy limpio y ordenado. A la media hora Andreas fue a coger unos papeles y ellos se fueron a desayunar a una cafetería que tenía muy buena pinta. Les atendió una chica muy agradable que cada vez que traía los platos les miraba y les decía "mi madre no sabe cocinar raciones más pequeñas, greek mom". Por 10 euros cada uno tomaron tostadas con aceite y ajo, tortilla francesa, yogur griego con nueces y fruta, croissant y café. Prácticamente hicieron un brunch. Al volverse a reencontrar con Andreas, le dijeron donde se encontraban desayunando y resultó ser la cafetería de la madre de Andreas. ¡La que nos sirvió era su hermana! Aunque Paleros es pequeñito fue bastante coincidencia. Después regresaron al barco donde Andreas terminó de enseñarles todo y les sacó las cartas náuticas para hacerle un resumen de la ruta que él recomendaba seguir. Les reservó puerto esa misma noche en Spartochori, donde sólo tenían que cenar en la Taverna del puerto para poder pasar ahí la noche. Iban a mantener el contacto con Andreas durante toda la travesía por lo que no había ningún problema en el caso de alguna duda. Se fue contento y muy tranquilo diciéndoles que se notaba que sabían lo que hacían. ¡Ya estaban listos para partir!

Esta era la ruta que iban a hacer la primera semana por las islas del sur: Meganisi, Lefkada, Ithaca, Kefalonia, Kastos y Kalamos.

Salieron del puerto de Paleros con éxito y fueron en hacia una bahía que se encontraba cerca llamada Vathiavali Beach, anclaron allí y se dieron un bañito. Después partieron hacia la isla de Meganisi en busca del puerto de Spartochori. Por el camino sacaron las velas. Era la primera vez conociendo a Mr. Bojangles, descubriendo cómo se comportaba y si respondía bien a las demandas de la tripulación. Fue súper bonito. Como buena primera navegación, hubieron algunos más que menos en el proceso de emproarse, sacar las velas, cazar y largar. El piloto automático estaba roto. Estupendo. Andreas dijo que en algún momento de la travesía vendría a arreglarlo. Dudosa afirmación de la cual no sabían si iba a ser verdad. No podían soltar las manos del timón y siendo dos personas en un barco de esas dimensiones, hicieron lo que pudieron. Como siempre, salió todo genial. Esta primera navegación fue corta y les dejó con las ganas suficientes para seguir navegando en los próximos días.

Al recoger las velas y aproximarse al puerto llamado Porto Spilia (donde Andreas "supuestamente" había reservado) llamaron por la radio para saber dónde tenían que atracar. En la radio no contestaron por eso decidieron llamar por teléfono. Un hombre muy seco respondió y a pesar de preguntarle, no decía exactamente a dónde se tenían que dirigir, simplemente gritaba "Come in, come in". Después de tantos intentos por descubrir hacia dónde tenían que dirigirse, el hombre decidió colgar de forma brusca. Al aproximarse, vieron al hombre (bajito con barriga y un gorro muy característico) gesticular con las manos de forma desordenada. Finalmente anduvo hasta el punto de amarre en cuestión. Era la primera vez que atracaban y no estaban familiarizados con la marcha atrás de Mr. Bojangles. El barco era muy largo y sólo tenía hélice de popa por lo que respondía muy tarde a la orden del timón. Lo intentaron varias veces con los ojos de los tripulantes de los demás barcos mirando con mucha atención. El hombre gritaba impacientemente, hacía muchas señas y se desesperaba de una forma bastante chocante. Su carácter agrio le llevó a perder el control de sí mismo y decidió que la mejor opción era echarles del puerto. Les gritó desde la distancia "Go, go. Leave. Leave my port". Ellos, perplejos, siguieron con la maniobra y enseguida el barco consiguió enderezarse y por fin pudieron amarrarlo. El resto de barcos les dijeron "Good job, don't worry, he is grumpy with everyone" (Buen trabajo, no os preocupéis, él es gruñón con todo el mundo). Con mucho sudor (eran las 5 de la tarde y el sol picaba) y mucha tensión al final pudieron tomar un respiro al apagar el motor. ¡Misión cumplida! Ya tenían dónde pasar la noche y lo más importante de todo, dónde cenar. El puerto era pequeñito y la Taverna estaba justo al lado. Se llamaba "Taverna Spilia". Tras todo el ajetreo y una fría ducha fueron a la Taverna a cenar. Se encontraron al hombre, esta vez sentado en la entrada de la taberna mirando a la gente pasar mientras observaba el horizonte de la bahía. Ellos decidieron saludar con mucha educación y entablar una conversación con el hombre. Se podía intuir que había pasado toda su vida haciendo lo mismo y que a pesar de ser pequeño, el puerto estaba bastante transitado por lo que no necesitaba atraer a nadie con su simpatía. Les contaron al hombre que eran de España y éste con un tono un poco más agradable les contestó que por qué no llevaban colgada la bandera de España en el barco, que si hubiera sido así, les hubiera recibido de una mejor forma. Después de la conversación se sentaron a cenar. Pidieron una ensalada griega (tomate, cebolla, pimiento verde, olivas y queso feta), un pulpo en vinagre y de segundo una lubina al grill que también venía con ensalada de acompañamiento. También brindaron con una cerveza por su primer día de aventuras en el Mr. Bojangles y por haber superado el primer atraque dirigido por semejante personaje. Al volver al barco jugaron a las cartas. Jugaron al "rápido" y a la "brisca". Se rieron mucho recordando lo sucedido y se fueron a dormir. ¡Increíble entrada en el mar Jónico!`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/captura-de-pantalla-2023-07-14-a-las-5.26.46-p.e280afm.png',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/captura-de-pantalla-2023-07-14-a-las-6.00.47-p.e280afm.png',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9951.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9949-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9934.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9966-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9971-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9952-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9941.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_4593.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9982-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9976-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_4598.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9977.jpg',
    ],
  },
  {
    num: 5,
    title: 'Explorando Meganisi y llegada a Sivota (Lefkada)',
    date: '10 Julio 2023',
    restaurants: [
      ref('Taverna de Porto Spilia', 'Porto Spilia Meganisi', undefined, 'https://www.google.com/maps/search/?api=1&query=Porto%20Spilia%2C%20Spartochori%2C%20Meganisi%2C%20Greece'),
      ref('12 Gods', '12 Gods Sivota Lefkada', 'http://www.12gods.gr/', 'https://www.google.com/maps/search/?api=1&query=12%20Gods%2C%20Sivota%20310%2082%2C%20Lefkada%2C%20Greece'),
      ref('Comida a bordo en Papageorge\'s Cove'),
    ],
    places: [
      ref('Porto Spilia'),
      ref('Meganisi'),
      ref('Cueva del oeste de Meganisi'),
      ref('Papageorge\'s Cove'),
      ref('Sivota'),
      ref('Lefkada'),
      ref('Puerto de Sivota'),
    ],
    summaryGroups: [
      {
        place: placeRef('Meganisi', 'Meganisi Greece'),
        restaurants: [
          ref('Taverna de Porto Spilia', 'Porto Spilia Meganisi', undefined, 'https://www.google.com/maps/search/?api=1&query=Porto%20Spilia%2C%20Spartochori%2C%20Meganisi%2C%20Greece'),
        ],
        places: [
          placeRef('Porto Spilia', 'Porto Spilia Meganisi Greece'),
          placeRef('Meganisi', 'Meganisi Greece'),
          ref('Cueva del oeste de Meganisi'),
          ref('Papageorge\'s Cove'),
        ],
      },
      {
        place: placeRef('Sivota, Lefkada', 'Sivota Lefkada Greece'),
        restaurants: [ref('12 Gods', '12 Gods Sivota Lefkada', 'http://www.12gods.gr/', 'https://www.google.com/maps/search/?api=1&query=12%20Gods%2C%20Sivota%20310%2082%2C%20Lefkada%2C%20Greece')],
        places: [
          placeRef('Sivota', 'Sivota Lefkada Greece'),
          placeRef('Lefkada', 'Lefkada Greece'),
          placeRef('Puerto de Sivota', 'Sivota Lefkada Port Greece'),
        ],
      },
    ],
    text: `Capítulo 5 – Explorando Meganisi y llegada a Sivota (Lefkada)

10. Julio. 2023.

A las 9 de la mañana abría la Taverna para el desayuno. A esa hora estaban allí pidiendo una tortilla francesa y un Greek Coffee.

La ruta del día pintaba muy bien. La isla elegida para explorar ese día era Meganisi. El recorrido era: salir de Porto Spilia rumbo al Oeste de Meganisi para hacer la primera parada en una cueva y después navegar hacia el sur de la isla para parar en la cala de Papageorge's cove a comer. Después de comer la idea era navegar hacia el puerto de Sivota, donde podrían cenar y pasar la noche.

Al principio de la travesía no había viento para poder sacar las velas. Usaron el motor una hora hasta que poco a poco el Dios Eolo decidió hacer de las suyas. Cuando el viento se levantó pudieron empezar a jugar otra vez con Mr. B. El trayecto se hizo muy ameno y estaban tan entretenidos jugando que decidieron pasar de largo por la cueva y llegar directamente al sur donde estaba la cala esperada. Así lo hicieron, al cabo de unas dos horitas de navegación pusieron sus ojos en la pequeña cala de Papageorge's cove. No miraron fotos ni sabían exactamente que iban a acabar allí ya que Andreas sugirió el «swim stop» en todo el sur de Meganisi pero no especificó la playa/cala exacta. Ellos decidieron que este lugar era el adecuado. Y así fue, estaban prácticamente solos y el lugar era precioso.

El lateral de piedra era muy rasgado y las líneas verticales que lo conformaban eran preciosas. Hicieron fotos con el móvil y con la cámara, y tras haber fotografiado el lugar desde todos sus ángulos decidieron tirarse al agua. Usaron el Padel Sup para acercarse a la rocosa orilla. Estuvieron buceando un rato hasta que les entró un pelín de hambre. Comieron unos macarrones con salsa de tomate y atún. Tras reposar la comida llegó el momento de coger rumbo a Sivota ya que tenían que estar en el puerto sobre las 5 de la tarde. Subieron la escalerilla y recogieron el ancla mientras miraban al paisaje pensando lo afortunados que habían sido por encontrar esa cala tal día como aquel, un día sin viento y con el cielo totalmente despejado. ¡Estuvieron de lujo!

Ahora vino el momentazo. ¡Viento en popa a toda vela! Navegaron todo el camino a Sivota a unos 7 nudos de velocidad. Preciosa sensación la de sentir el aire en la cara y escuchar las olas acariciando el barco. Qué mejor forma que pasar un 10 de Julio surcando los mares del Mar Jónico en el Mr. B? Sólo podían sentir gratitud.

Al adentrarse al puerto de Sivota, llamaron por la radio: "Mr. Bojangles here, do you copy?". Respondió un hombre que les dijo que tenían que continuar hasta el final del puerto donde verían una "red flag" y que les daría la "lazy line in Starboard". Es decir, tenían que aproximarse a una bandera roja y al llegar les darían la guía por estribor. Ellos tras mucho esforzarse por encontrar la bandera roja no la veían. Finalmente vino el hombre en el dinghy y les guió a su punto de amarre. Este atraque fue a la primera. El del día anterior sirvió de mucha experiencia.

Se ducharon en el restaurante donde había reservado Andreas para cenar. La Taverna se llamaba «12 gods» y la reserva era a las 20:30. Pidieron de entrante berenjena con feta y salsa de tomate y de segundo un pescado al grill con verduras.

¡Un día redondo!`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9980-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/captura-de-pantalla-2023-07-15-a-las-9.18.12-p.e280afm.png',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02754.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02781.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02788.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9991.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02795.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0026.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0040-1.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0039-edited.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0127.jpg',
    ],
  },
  {
    num: 6,
    title: 'Lo que el viento se llevó',
    date: '13 Julio 2023',
    restaurants: [
      ref('Taverna del puerto de Kastos', 'Kastos port taverna Greece'),
      'Cena a bordo: café, avena y melocotón',
    ],
    places: [
      ref('Ithaka'),
      ref('Atokos'),
      ref('Playa de Atokos'),
      ref('Kastos'),
      ref('Puerto de Kastos'),
      'Bahía de Kastos',
      ref('Mini Mr. Bojangles'),
    ],
    summaryGroups: [
      {
        place: placeRef('Atokos', 'Atokos Greece'),
        places: [
          placeRef('Ithaka', 'Ithaca Greece'),
          placeRef('Atokos', 'Atokos Greece'),
          placeRef('Playa de Atokos', 'Atokos Beach Greece'),
        ],
      },
      {
        place: placeRef('Kastos', 'Kastos Greece'),
        restaurants: [ref('Il Porto Taverna', 'Il Porto Taverna Kastos', undefined, 'https://www.google.com/maps/search/?api=1&query=Il%20Porto%20Taverna%2C%20Kastos%20310%2081%2C%20Greece')],
        places: [
          placeRef('Kastos', 'Kastos Greece'),
          placeRef('Puerto de Kastos', 'Kastos Port Greece'),
          placeRef('Bahía de Kastos', 'Kastos Bay Greece'),
        ],
      },
    ],
    text: `¡Buenos días!

Tras un café y una avena con melocotón, cogieron rumbo al Este a Kastos. La parada para comer era en Atokos.

Este día empezó a levantarse el viento mucho más que los días anteriores. Cómo no, aprovecharon para sacar las velas una vez más. Ya se notaban con más confianza y todo salía mucho más fácil porque cada uno sabía lo que tenía que hacer y en qué momento hacerlo.

Dejando la famosa Ithaka detrás, estaban intrigados por lo que les esperaba. Habían escuchado que Kastos y Kalamos eran muy bonitas y al ser pequeñas serían muy auténticas. Viento en popa a toda vela, tras una navegación de unas dos horas llegaron a la playa de Atokos. Estaba llena de barcos y hacía mucho viento. La isla tenía una playa en medio y justo en la bahía no había montaña detrás que cortara el viento. Intentaron encontrar su hueco y tras varios intentos de echar y subir el ancla, viendo que el barco estaba muy pegado a los otros y viendo que no podían predecir bien los soplidos de viento repentinos, decidieron marcharse hacia su destino final, Kastos. Fue una parada de "descanso" y no les importó mucho irse y continuar su rumbo.

De comer hicieron por el camino unos huevos revueltos acompañados de tomates cherry (fueron revueltos porque no pudieron ser de otra forma, el vaivén del barco no dejó que fueran de otra forma).

Por fin, llegaron a Kastos donde el viento se notaba menos ya que la propia isla lo frenaba. Llegaron al puerto donde había un muelle chiquitito y no había espacio para ellos. Finalmente decidieron quedarse justo a las afueras del puerto en una pequeña bahía. Echaron el ancla y apagaron el motor, contemplando dónde iban a pasar la noche y observando el movimiento del barco para que no chocara con el resto y para que no se fuera hacia las rocas si el viento decidiera cambiar de dirección. Al fin, se relajaron y se dieron un baño. Padel Sup al agua era siempre el primer paso indicativo de que ya estaban asentados y tranquilos.

Después de un baño muy agradable, llamaron a la Taverna del puerto (tenía muy buenas valoraciones en Tripadvisor) para reservar una mesa a las 20:30. Se ducharon, y se pusieron guapos, metieron los ordenadores con sus respectivos cargadores en la mochila para poder cargarlos en la Taverna y se subieron al dinghy. Esta zodia era mini Mr. Bojangles. Una mini embarcación que les iba a dar muchas historias que contar.

Confiados en que mini Mr. B fuera igual de fiable que big Mr. B (nótese la ironía), se metieron en la zodiac con todo preparado (incluida la bolsa de basura) y el motor al encenderlo vieron que no tenía potencia. Por más marcha que le daban, no avanzaba. Iban en contra del viento y sin avanzar. Enseguida también se dieron cuenta que habían olvidado los remos en el barco. Total, tenían el viento en contra, el motor apagado e iban sin remos. Donde el viento les llevara (gone with the wind). Por extrañas casualidades de la vida, los del catamarán de atrás suyo eran españoles y pudieron echarles una mano. Enseguida les vieron que estaban a la deriva y les tiraron su remo. ¡Menos mal que estaban fuera y pudieron ver el suceso! Cogieron el gran remo de los españoles y con mucha fuerza y calándose de agua la ropa arreglada, llegaron al barco. Ya estaban a salvo.

Tenían que pensar su próxima jugada. Qué le pasaba al motor? Se quedarían sin ir al restaurante porque el dinghy no funcionaba? Había que devolverle el remo a los españoles. Qué podían hacer? El primer paso fue sacar sus propios remos y colocarlos bien dentro de mini Mr. B. El segundo paso era intentar ver qué le pasaba al motor, sin soltar la zodiac del barco. Con lo cual, uno se quedo en el barco y el otro en la zodíaco testando el funcionamiento del motor. Finalmente vieron que el motor funcionaba pero no tenía punto muerto y que además le entraba aire y no tenía potencia. Por lo que la solución era cerrar un botón por donde le entraba el aire y asegurarte estar lejos de obstáculos ya que nada más arrancar la zodiac salía disparada. Al final, uno se fue a devolverle el remo a los españoles y el otro se quedó esperando a que todo fuera bien. Por el camino hubieron unos de Israel que iban de camino al puerto también. Les ofrecieron ayuda y les dieron su número de teléfono. No quisieron la ayuda ya que se veían capaces de salir airosos de esta ellos solitos.

Al final, los salvadores que veis en la imagen, fueron otra segunda pareja que se ofrecieron a ayudarles para llevarles al puerto a cenar. Y así fue. Eran unos suizos muy simpáticos. El motor de su dinghy era eléctrico y no emitía ni un ruido. Igualito que mini Mr. B. Ya sabían que no podía ser de otra forma, tanto big B como mini B, no pasaban desapercibidos allá donde iban.

Por fin llegaron a puerto! ¡Mmmmmm… la cena (casi no cena) merecida les estaba esperando! Pidieron berenjena, anchovies, Tzatziki y un atún poco hecho. ¡Todo delicioso!

La vuelta al barco fue con los mismos salvadores suizos. Todo fue muy bien. Al llegar al barco recordaron lo bien que habían salido de la situación y sólo tenían ganas de que el siguiente día amaneciera para poder probar otra vez a mini Mr. B y conocerse mejor. Fue un día, como todos los anteriores, lleno de anécdotas que contar.`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/captura-de-pantalla-2023-07-21-a-las-5.41.21-p.e280afm.png',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0223-3.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0230-1-75306370-e1690018777135.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0234-1-57982302-e1690018750405.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0241-3529839798-e1690020270887.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_4852.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_4851.jpg',
    ],
  },
  {
    num: 7,
    title: 'Kalimera o Kalamos?',
    date: '14 Julio 2023',
    restaurants: [
      'Cafetería del puerto de Kastos',
      ref('George\'s Taverna', 'George\'s Restaurant Kalamos Greece'),
      'Cafetería del puerto de Kalamos',
    ],
    places: [
      ref('Kastos'),
      ref('Cala de entrada a Kastos'),
      ref('Asprogiali Beach'),
      ref('Kalamos'),
      ref('Puerto de Kalamos'),
      ref('Lefkada'),
    ],
    summaryGroups: [
      {
        place: placeRef('Kastos', 'Kastos Greece'),
        restaurants: [],
        places: [placeRef('Kastos', 'Kastos Greece'), ref('Cala de entrada a Kastos')],
      },
      {
        place: placeRef('Kalamos', 'Kalamos Greece'),
        restaurants: [
          ref('George\'s Taverna', 'George\'s Restaurant Kalamos Greece', undefined, 'https://www.google.com/maps/search/?api=1&query=George%27s%20Restaurant%2C%20Kalamos%2C%20Greece'),
        ],
        places: [
          placeRef('Asprogiali Beach', 'Asprogiali Beach Kalamos Greece'),
          placeRef('Kalamos', 'Kalamos Greece'),
          placeRef('Puerto de Kalamos', 'Kalamos Port Greece'),
          placeRef('Lefkada', 'Lefkada Greece'),
        ],
      },
    ],
    text: `¡Kalimera!

«Kalimera» significa «Hola» en griego. Hoy era el día de partir hacia Kalamos. Se confundían con los nombres de las islas pero esque ésta isla en croqueta era muy liosa de decir. «Hoy iremos a….Kali…m….cosmos? Ah no Cosmos era cómo llamaban a Kastos. En fin, después de conseguir sacar la palabra Kalamos de sus memorias (el calor no les dejaba pensar) ¡Comenzaron el día! El plan era salir de Kastos y llegar a Kalamos. Fácil, como la vida misma.

Aquel día no tenían mucha prisa en llegar ya que las islas se encontraban muy cercanas entre sí. Decidieron sacar a mini Mr.B de paseo. Cogieron las basuras y fueron en busca de un contenedor donde tirarlas y un buen desayuno. Todo fue bien con la zodiac. Lo único fue que costaba arrancarla y que como no tenía punto muerto pues al llegar a los muelles había que quitarle el hombre al agua unos metros antes de estamparse. Al final remaron el último tramo para ser precavidos.

Al llegar al puerto preguntaron dónde estaban los contenedores. Resulta que no había. No dejaban tirar basura. No pasaba nada, vuelta a cuestas con las basuras en mini Mr. B. El sol ya picaba muy fuerte a las 9 de la mañana. Encontraron un sitio agradable de desayuno y se sentaron dentro a la sombra. Se pidieron dos capuchinos, unas tostadas y un yogur griego con miel y nueces.

Después del desayuno pasaron por un Mini Market en el que compraron más provisiones. Cebollas, berenjenas, calabacines, melocotones, yogures, arroz blanco, pollo, leche de coco, curry y latas de sardinas, caballa y atún. ¡Ya estaban listos para subsistir más días!

Al regresar al barco, ordenaron todo y enseguida subieron el ancla y salieron de la maravillosa cala a la entrada de Kastos que tantos momentos de incertidumbre/desesperación/risas les había producido la tarde anterior.

Como no tenían prisa decidieron mirar el mapa para ver qué cala/playa había de camino a Kalamos. Encontraron la maravillosa Asprogiali Beach, que se encontraba noreste de Kalamos. Allá que pusieron rumbo y en unos cuarenta minutos aproximadamente llegaron a semejante paraíso.

¡Vaya baño se dieron! Dieron un buen paseo en Padel Sup para avisar a todo el mundo que habían llegado. Llegaron hasta una pequeña orilla de rocas donde se bajaron un momento para apreciar la belleza que tenían detrás. Sus vistas eran a Mr. Bojangles y a la costa de Grecia por detrás. Inmensas montañas conformaban el paisaje. Simplemente fue espectacular.

Al terminar, tenían hambre y tenían pensado hacer el pollo al curry. ¡No quedaba gas! Qué más cosas podían pasar? Los dioses griegos se pusieron de acuerdo para que les pasaran todas a ellos. Decidieron hacerse de comida unos tomates partidos con queso feta y aceitunas. Arreglado.

Después de reposar la comida cogieron rumbo a Kalamos. Allí tenían reserva en el puerto (Andreas lo gestionó) mientras cenaran en la Taverna de George (George's Taverna). Tenían que llegar al puerto antes de las 5 por una extraña razón, ya que no entendían por qué tenían que llegar tan pronto si realmente estaba reservado para ellos. No obstante, no querían más obstáculos por el camino por lo que llegaron a las cuatro y media. Pegaba el sol fuerte fuerte. George vino a indicarles saludando con un gorro característico desde la distancia. Allí que atracaron, de una forma muy griega. Echaron el ancla a mucha distancia del muelle y dándole marcha atrás despacito el barco se posicionaba griegamente. Les tiraron las amarras a George y enseguida estaban en su sitio. George amablemente les invitó a cenar en su Taverna. Necesitaban agua porque e depósito del barco estaba casi vacío e iban e reserva por lo que le preguntaron a George y este respondió «tomorrow morning». Su respuesta sonaba dudosa, muy incierta pero ellos decidieron confiar en que se hiciera realidad. No les quedaba otra que esperar al día siguiente por la mañana.

Eran las 5 de la tarde y decidieron ir a una cafetería del puerto en busca de sombra y agua. Se llevaron los ordenadores para cargarlos. De camino a la cafetería estaba la Taverna de George y reservaron para cenar esa noche. La chica para hacer la reserva les preguntó cuál era el nombre del barco, respondieron «Mr. Bojangles» y la chica, perpleja dijo «nevermind, what is your name». Otra vez el Mister destacando. Se pidieron un iced latte y estuvieron unas dos horas trabajando. Fue productivo. Regresaron al barco para «ducharse», es decir, con los pocos recursos que tenían enjuagarse de forma rápida) porque tenían la cena en la Taverna.

Al llegar a la Taverna, ¡una mesa muy bonita les esperaba!

Pidieron Mousakka y una hamburguesa. Decidieron probar una botella de vino griega, pidieron un red dry wine de Lefkada que se llamaba Vertzamo. Estaba muy bueno. Tras una agradable cena en el entorno idílico.`,
    images: [
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/captura-de-pantalla-2023-07-21-a-las-5.41.01-p.e280afm.png',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0261.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0262.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0265-2.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0266.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0278-2157248465-e1690029103954.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0279-4153659207-e1690029208480.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0298-504877663-e1690029369449.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0302-784525887-e1690029479703.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0320-4076530065-e1690030645473.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0319-2685026214-e1690030598129.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0326-463031460-e1690030780399.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0333-1927842154-e1690030839279.jpg',
      'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0332-99606796-e1690030894559.jpg',
    ],
  },
];
