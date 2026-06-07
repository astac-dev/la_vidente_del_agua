// src/game/script.js

const gameScript = {
  capitulo_1: {
    escenas: {
      escena_intro: { // ESCENA 1.1: EL PRECIO DEL INSOMNIO
        type: 'dialogue',
        background: { src: '/backgrounds/bg_recamara_amaranta_cdmx_noche.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_trauma_silencio.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_reloj_tic_tac.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'Ciudad de México. 15 de diciembre de 2011.'
          },
          {
            personaje: 'narrador',
            texto: 'Para la mayoría de los estudiantes, diciembre es sinónimo de fiestas, descanso y el cierre de un ciclo escolar exitoso.'
          },
          {
            personaje: 'narrador',
            texto: 'Para Amaranta, es el recordatorio de que su mente se está desmoronando.'
          },
          {
            personaje: 'sistema',
            texto: '[EFECTO VISUAL: Parpadeo de pantalla en rojo tenue / Desenfoque de cámara]\n[SFX: Sonido de respiración agitada y dolor de cabeza punzante]'
          },
          {
            personaje: 'amaranta',
            texto: '(Con la mirada perdida, sosteniendo un vaso de agua con manos temblorosas) Otra vez... Otra vez la misma sed maldita. Siento que tengo los pulmones llenos de polvo... y la cabeza a punto de estallar.'
          },
          {
            personaje: 'narrador',
            texto: 'A sus 16 años, la vida de Amaranta solía ser predecible y brillante. Hija de un médico y una gerente de ventas, las calificaciones nunca habían sido un problema. Era la alumna ejemplar, la amiga sonriente.'
          },
          {
            personaje: 'narrador',
            texto: 'Hasta que llegaron los sueños. O mejor dicho, las ausencias.'
          },
          {
            personaje: 'amaranta',
            texto: '(Frustrada, arroja el vaso de plástico sobre el escritorio) ¡No quiero dormir! Cada vez que cierro los ojos, ese maldito vacío me traga. Siento el frío de la piedra, la oscuridad... y el miedo de alguien que no soy yo.'
          },
          {
            personaje: 'narrador',
            texto: 'El insomnio crónico no tardó en cobrar factura. El rendimiento académico impecable cayó en picada; el cansancio acumulado transformó su habitual calidez en una versión gris, triste y de cambios de humor repentinos que asustaron a sus padres y alejaron a sus amigos.'
          },
          {
            personaje: 'narrador',
            texto: 'Tras una gran cantidad de estudios médicos en el hospital para descartar problemas neurológicos y hormonales, el diagnóstico final fue tajante: "Colapso nervioso por estrés severo". ¿La receta? Tres meses de aislamiento fuera de la ciudad y reposo.'
          }
        ],
        next: 'escena_1_2'
      },
      escena_1_2: { // ESCENA 1.2: EL RESPIRO DE TULUM
        type: 'dialogue',
        background: { src: '/backgrounds/bg_fachada_casa_abuela.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_brisa_tropical.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_candelilla_cigarras.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'El remedio de sus padres fue enviarla lejos del ruido de la capital. Destino: Tulum, Quintana Roo, bajo el cuidado de su abuela. Un respiro necesario mientras ellos continuaban con sus jornadas laborales en la gran ciudad.'
          },
          {
            personaje: 'narrador',
            texto: 'Los primeros tres días en el caribe funcionaron como un bálsamo milagroso. Por fin, Amaranta pudo conciliar el sueño de forma natural, sin la humillante necesidad de recurrir a las pastillas para dormir.'
          },
          {
            personaje: 'narrador',
            texto: 'El aire puro de la selva parecía haber ahuyentado a los fantasmas de su cabeza. Pero la calma en la superficie del suelo de Yucatán siempre es un espejismo.'
          },
          {
            personaje: 'narrador',
            texto: 'Al cuarto día, durante una caminata de regreso a casa por los senderos menos transitados de la localidad, la paz se rompió.'
          }
        ],
        next: 'escena_1_3'
      },
      escena_1_3: { // ESCENA 1.3: LOS GUARDIANES DEL ABISMO
        type: 'dialogue',
        background: { src: '/backgrounds/bg_sendero_selva_campamento.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_misterio_cientifico.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_motor_diesel.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'amaranta',
            texto: '(Escondiéndose ligeramente detrás de un arbusto, observando con los ojos de par en par) ¿Pero qué...? Este camino suele estar completamente desierto. ¿Qué hace toda esta gente aquí?'
          },
          {
            personaje: 'narrador',
            texto: 'Frente a ella, la quietud del pueblo se había transformado en un despliegue logístico incomprensible. Camionetas todoterreno con logotipos institucionales oficiales, plantas de luz rugiendo en la maleza y personal técnico moviéndose con urgencia.'
          },
          {
            personaje: 'narrador',
            texto: 'No eran turistas, ni policías comunes. Eran buzos de exploración cargando tanques dobles de heliox, especialistas transportando computadoras de alta resistencia para mapeo tridimensional y científicos con chalecos de campo del INAH analizando planos topográficos.'
          },
          {
            personaje: 'amaranta',
            texto: '(Murmurando para sí misma) Llevan trajes de neopreno... y esas cajas amarillas parecen equipos de rescate o de laboratorio... ¿Qué habrán encontrado ahí abajo? ¿Una cueva nueva?'
          },
          {
            personaje: 'sistema',
            texto: '[EFECTO VISUAL: Destello blanco súbito en el centro de la pantalla]\n[SFX: Un latido sordo e interno: *DUM-DUM*]'
          },
          {
            personaje: 'amaranta',
            texto: '(Llevándose la mano a la frente con un gesto de dolor agudo) ¡Ah...! Maldita sea... ¿otra vez? Justo en el centro de la frente... Siento una punzada helada, como si me clavaran una aguja de hielo.'
          },
          {
            personaje: 'narrador',
            texto: 'La presión en su cabeza fue tan intensa que la obligó a retroceder y tomar el camino largo a casa. A medida que se alejaba del campamento científico, el dolor comenzó a ceder, dejándole únicamente una extraña sensación de urgencia y una profunda sed.'
          }
        ],
        next: 'escena_1_4'
      },
      escena_1_4: { // ESCENA 1.4: LA ADVERTENCIA DEL FRASCO
        type: 'dialogue',
        background: { src: '/backgrounds/bg_recamara_abuela_noche.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_preludio_sueno.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_viento_selva.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'La cena con su abuela transcurrió con normalidad. Las risas y las historias locales lograron disipar el misterio de esos hombres y el dolor de cabeza de Amaranta. Sin embargo, al subir a su habitación, la noche adquirió un peso distinto.'
          },
          {
            personaje: 'narrador',
            texto: 'Tras tomar una ducha, se dispuso a leer un rato para despejar la mente. Pero al apagar la lámpara, sus ojos se posaron inevitablemente sobre la mesa de noche.'
          },
          {
            personaje: 'sistema',
            texto: '[EFECTO VISUAL: Enfoque de cámara hacia el frasco de medicamentos]'
          },
          {
            personaje: 'amaranta',
            texto: '(Mirando fijamente el frasco de pastillas para dormir) No las he tocado desde que llegué... He dormido bien. Pero... ¿por qué siento este escalofrío? Siento que esta noche... Esta noche va a ser diferente. Si no me tomo la pastilla, el vacío me va a atrapar otra vez.'
          },
          {
            personaje: 'narrador',
            texto: 'A pesar de la fuerte intuición que recorrió su espina dorsal, el orgullo y el deseo de mantenerse limpia ganaron la batalla. Apartó la mirada, dio un leve suspiro y se acomodó entre las sábanas, cerrando los ojos.'
          },
          {
            personaje: 'narrador',
            texto: 'Pasaron dos horas. El sueño la arrastró suavemente hacia un estado profundo de inconsciencia.'
          },
          {
            personaje: 'narrador',
            texto: 'Hasta que el calor desapareció. El aire acondicionado de la habitación fue sustituido por una corriente helada y húmeda. El olor a selva se transformó en el aroma a piedra caliza rancia y confinamiento milenario.'
          },
          {
            personaje: 'sistema',
            texto: '[EFECTO VISUAL: La pantalla se oscurece por completo de forma lenta]\n[BGM: Detener BGM por completo]\n[SFX: Sonido lejano de goteo de agua con eco profundo: *Ploc... Ploc...*]'
          },
          {
            personaje: 'narrador',
            texto: 'El viaje en el tiempo había comenzado.'
          }
        ],
        next: 'escena_1_5'
      },
      escena_1_5: { // ESCENA 1.5: LA TRAMPA NATURAL (EL SUEÑO DE NAIA)
        type: 'dialogue',
        background: { src: '/backgrounds/bg_hoyo_negro_pleistoceno_oscuro.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_terror_ancestral.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_eco_caverna_seca.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'Amaranta ya no está en su cama. Su conciencia ha sido arrastrada trece mil años al pasado.'
          },
          {
            personaje: 'narrador',
            texto: 'A través de los ojos de un cuerpo que no le pertenece, sostiene una antorcha de resina con la mano derecha. Las llamas bailan con desesperación, devoradas por una negrura tan densa que ninguna luz parece capaz de perforarla.'
          },
          {
            personaje: 'naia',
            texto: '(Respiración entrecortada, tacto seco en la garganta) Tengo tanta sed... La tierra afuera está muriendo y aquí abajo... Aquí abajo solo hay piedra.'
          },
          {
            personaje: 'narrador',
            texto: 'Frente a ella se abre solo oscuridad. Es el Hoyo Negro primigenio, mucho antes de que el fin de la era de hielo lo inundara. Sigue caminando en su trayecto, buscando algún rastro de agua.'
          },
          {
            personaje: 'sistema',
            texto: '[SFX: Un aleteo masivo, agudo y repentino: SFX_HORDA_MURCIELAGOS]\n[EFECTO VISUAL: Ráfaga de partículas negras cruzando la pantalla]'
          },
          {
            personaje: 'narrador',
            texto: 'El calor de la antorcha altera el descanso de una colonia de murciélagos oculta en el techo de la bóveda. Cientos de garras y alas ciegas impactan contra el rostro de la joven en un parpadeo de pánico.'
          },
          {
            personaje: 'naia',
            texto: '¡Ah! ¡Déjenme! ¡No veo nada!'
          },
          {
            personaje: 'narrador',
            texto: 'La horda de quirópteros nubla su vista por completo. Presa del terror, la chica suelta la antorcha, gira sobre su propio eje y da unos pasos a ciegas. Llegando a un paso fatal justo al borde del abismo.'
          },
          {
            personaje: 'narrador',
            texto: 'El suelo firme desaparece. La gravedad la reclama.'
          }
        ],
        next: 'escena_1_5_eleccion'
      },
      escena_1_5_eleccion: { // 🎮 INTERFAZ DE DECISIÓN CRÍTICA (EL DESCENSO)
        type: 'choice',
        pregunta: 'Elige la reacción de supervivencia de Naia.',
        opciones: [
          {
            texto: 'Proteger la cabeza y encoger el cuerpo en posición fetal.',
            action: { stat: 'preservacion', op: 'add', value: 1 },
            next: 'escena_1_5_ruta_a'
          },
          {
            texto: 'Extender los brazos para intentar aferrarse a las paredes rugosas.',
            action: { stat: 'confianza', op: 'add', value: 1 },
            next: 'escena_1_5_ruta_b'
          }
        ]
      },
      escena_1_5_ruta_a: {
        type: 'dialogue',
        background: { src: '/backgrounds/bg_pantalla_negra.jpg', transition: 'fade', duration: 500 },
        sfx: { src: '/sfx/sfx_caida_cuerpo_roca.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'El instinto de conservación la obliga a encogerse en el aire. Su cuerpo rueda y rebota violentamente contra los salientes del túnel calizo. El dolor es un destello blanco en su mente.'
          },
          {
            personaje: 'sistema',
            texto: '[SFX: Crujido óseo limpio y agudo: SFX_FRACTURA_PELVIS]'
          },
          {
            personaje: 'naia',
            texto: '(Un grito ahogado que se corta instantáneamente por el impacto) ¡Gah...!'
          },
          {
            personaje: 'narrador',
            texto: 'El golpe final en el fondo de la fosa seca fractura su cadera de manera limpia. El impacto resuena en el frío eco del lugar, seguido de un silencio sepulcral que vuelve a apoderarse de la cueva oscura.'
          }
        ],
        next: 'escena_1_6'
      },
      escena_1_5_ruta_b: {
        type: 'dialogue',
        background: { src: '/backgrounds/bg_pantalla_negra.jpg', transition: 'fade', duration: 500 },
        sfx: { src: '/sfx/sfx_arrastre_piel_aspera.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'En un acto desesperado, extiende las extremidades buscando un soporte. Sus manos y piernas se desgarran contra la superficie áspera y afilada de la cueva, frenando el descenso solo unas milésimas de segundo antes de la caída libre.'
          },
          {
            personaje: 'sistema',
            texto: '[SFX: Múltiples fracturas consecutivas y quejido sordo: SFX_FRACTURA_MULTIPLE]'
          },
          {
            personaje: 'naia',
            texto: '(Un gemido largo, un quejido que se apaga lentamente) Uh... uuh...'
          },
          {
            personaje: 'narrador',
            texto: 'Los brazos extendidos absorben el impacto de forma destructiva, quebrando múltiples huesos antes de que su cuerpo quede inerte en el suelo. Es el último quejido de la adolescente antes de que el silencio absoluto lo devore todo.'
          }
        ],
        next: 'escena_1_6'
      },
      escena_1_6: { // ESCENA 1.6: EL RETORNO AL PRESENTE
        type: 'dialogue',
        background: { src: '/backgrounds/bg_recamara_abuela_noche.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_despertar_trauma.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_respiracion_agitada_amaranta.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'amaranta',
            texto: '(Despierta de golpe, abriendo los ojos de par en par, llevándose las manos al cuerpo) ¡¡Ah ...!! ¡No, no, no!'
          },
          {
            personaje: 'sistema',
            texto: '[EFECTO VISUAL: Vibración de pantalla / Temblores en la cámara]'
          },
          {
            personaje: 'amaranta',
            texto: '(Tocándose la cadera y los brazos con desesperación) ¿Estoy armada? ¿Estoy rota? Juro que escuché mis propios huesos romperse... Sentí el frío de la piedra en mi espalda... ¡Siento los brazos congelados!'
          },
          {
            personaje: 'narrador',
            texto: 'Amaranta se levanta de la cama tropezando con sus propias sábanas. El ardor en su garganta es real, una sed monstruosa que la hace sentir como si hubiera caminado días enteros bajo el sol del desierto.'
          },
          {
            personaje: 'narrador',
            texto: 'Camina a tropezones hacia la cocina. El agua fría del refrigerador apenas logra calmar la quemazón interna. Al regresar a su recámara, la luz de la luna plateada revela el frasco sobre la mesa de noche.'
          },
          {
            personaje: 'amaranta',
            texto: '(Sosteniendo el frasco de pastillas con dedos temblorosos) Esto no fue una pesadilla normal... No fui yo quien cayó. Era otra persona. Una chica... una chica de mi edad con una antorcha. ¿Por qué puedo sentir su dolor? ¿Por qué se sintió tan real?'
          },
          {
            personaje: 'narrador',
            texto: 'Con el pulso acelerado y la certeza de que no podrá volver a conciliar el sueño por el miedo a regresar a esa fosa, destapa el frasco. Saca una pastilla. Sabiendo que ya pasó de la medianoche, la parte exactamente a la mitad con las uñas.'
          },
          {
            personaje: 'amaranta',
            texto: 'Si me la tomo completa, no voy a despertar mañana... Solo necesito apagar mi cerebro. Solo un poco.'
          },
          {
            personaje: 'sistema',
            texto: '[SFX: Sonido de tragar agua]\n[EFECTO VISUAL: Fundido a negro lento]'
          },
          {
            personaje: 'narrador',
            texto: 'La media dosis hace efecto tras una larga hora de angustia. Amaranta cae en un letargo artificial, libre de visiones, pero desprovisto de un descanso real.'
          }
        ],
        next: 'escena_1_7'
      },
      escena_1_7: { // ESCENA 1.7: LA MAÑANA DEL 24
        type: 'dialogue',
        background: { src: '/backgrounds/bg_cocina_abuela_dia.jpg', transition: 'fade', duration: 1000 },
        bgm: { src: '/music/bgm_diario_vivir.mp3', action: 'play' },
        sfx: { src: '/sfx/sfx_remanso_cocina.wav', action: 'play' },
        dialogos: [
          {
            personaje: 'narrador',
            texto: 'A la mañana siguiente, el calor de Tulum parece borrar las sombras de la madrugada. Amaranta entra a la cocina arrastrando los pies, ocultando las ojeras detrás de una sonrisa forzada para no alarmar a su abuela.'
          },
          {
            personaje: 'amaranta',
            texto: '(Pensando para sí misma mientras observa a su abuela cocinar) Si le digo lo que soñé... va a pensar que estoy completamente demente. "Abuela, soñé con una niña que murió hace miles de años en una cueva sin agua". Sí, claro. Directo de vuelta al hospital psiquiátrico.'
          },
          {
            personaje: 'sistema',
            texto: '[SFX: Tono de llamada de celular de 2011: SFX_TELEFONO_RING]'
          },
          {
            personaje: 'amaranta',
            texto: '(Saca el teléfono del bolsillo) ¿Mamá?'
          },
          {
            personaje: 'mama',
            texto: '(Voz a través del auricular, con tono apurado pero cariñoso) ¡Hola, mi amor! Solo llamaba para avisarte que tu papá y yo ya logramos coordinar los días libres. Salimos para allá mañana mismo. ¡Vamos a pasar este 24 de diciembre juntas en casa de la abuela!'
          },
          {
            personaje: 'amaranta',
            texto: '(Tratando de sonar entusiasmada) ¿En serio? Qué bueno, mamá... Sí, las espero. Aquí las cosas están... muy tranquilas.'
          }
        ],
        next: null
      }
    }
  }
};

export default gameScript;