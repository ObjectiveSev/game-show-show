export const SoundType = {
    SUCCESS: 'success',
    ERROR: 'error'
} as const;

export type SoundType = typeof SoundType[keyof typeof SoundType];

interface SoundItem {
    url: string;
    audio?: HTMLAudioElement;
}

interface SoundConfig {
    success: SoundItem[];
    error: SoundItem[];
    custom: Map<string, HTMLAudioElement>;
    gameSounds: Map<string, HTMLAudioElement>;
}

export class SoundManager {
    // Private variables
    private static instance: SoundManager;
    private soundConfig!: SoundConfig;
    private currentAudio: HTMLAudioElement | null = null;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private playPromise: Promise<void> | null = null;
    private isDestroyed: boolean = false;

    // Constructor
    private constructor() {
        this.loadSoundConfig();
    }

    // Public functions
    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public playSuccessSound(): void {
        if (this.isDestroyed) return;
        const soundItem = this.getRandomSound('success');
        if (soundItem) {
            this.playAudio(soundItem);
        }
    }

    public playErrorSound(): void {
        if (this.isDestroyed) return;
        const soundItem = this.getRandomSound('error');
        if (soundItem) {
            this.playAudio(soundItem);
        }
    }

    public playCustomSound(url: string): void {
        if (this.isDestroyed) return;
        try {
            let audio: HTMLAudioElement;

            // Verificar se já temos o Audio pré-carregado no map de custom sounds
            const existingAudio = this.soundConfig.custom.get(url);

            if (existingAudio) {
                audio = existingAudio;
                audio.currentTime = 0;
            } else {
                // Criar novo Audio
                audio = new Audio(url);

                // Salvar para reutilização no map de custom sounds
                this.soundConfig.custom.set(url, audio);
            }

            this.playAudio(audio);

        } catch (error) {
            console.error(`Erro ao tocar som customizado:`, error);
        }
    }

    public stopCurrentSound(): void {
        if (this.isDestroyed) return;
        if (this.currentAudio && !this.isPaused) {
            // Se há uma promise de play em andamento, aguardar
            if (this.playPromise) {
                this.playPromise.then(() => {
                    if (!this.isDestroyed && this.currentAudio) {
                        this.currentAudio.pause();
                        this.currentAudio.currentTime = 0;
                        this.currentAudio = null;
                        this.isPlaying = false;
                        this.isPaused = false;
                        this.playPromise = null;
                    }
                }).catch(() => {
                    // Se a promise falhou, limpar estado
                    if (!this.isDestroyed) {
                        this.currentAudio = null;
                        this.isPlaying = false;
                        this.isPaused = false;
                        this.playPromise = null;
                    }
                });
            } else {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio = null;
                this.isPlaying = false;
                this.isPaused = false;
            }
        }
    }

    public pauseCurrentSound(): void {
        if (this.isDestroyed) return;
        if (this.currentAudio && this.isPlaying && !this.isPaused) {
            // Se há uma promise de play em andamento, aguardar
            if (this.playPromise) {
                this.playPromise.then(() => {
                    if (!this.isDestroyed && this.currentAudio) {
                        this.currentAudio.pause();
                        this.isPaused = true;
                        this.isPlaying = false;
                    }
                }).catch(() => {
                    // Se a promise falhou, limpar estado
                    if (!this.isDestroyed) {
                        this.isPlaying = false;
                        this.isPaused = false;
                    }
                });
            } else {
                this.currentAudio.pause();
                this.isPaused = true;
                this.isPlaying = false;
            }
        }
    }

    public resumeCurrentSound(): void {
        if (this.isDestroyed) return;
        if (this.currentAudio && this.isPaused && !this.isPlaying) {
            this.playAudio(this.currentAudio);
        }
    }

    public playGameSound(gameId: string): void {
        if (this.isDestroyed) return;
        try {
            // Verificar se o jogo tem som configurado no map
            const existingAudio = this.soundConfig.gameSounds.get(gameId);

            if (!existingAudio) {
                console.warn(`Nenhum som configurado para o jogo: ${gameId}`);
                return;
            }

            this.playAudio(existingAudio);

        } catch (error) {
            console.error(`Erro ao tocar som do jogo ${gameId}:`, error);
        }
    }

    public cleanup(): void {
        this.isDestroyed = true;

        // Limpar promise atual
        if (this.playPromise) {
            this.playPromise = null;
        }

        // Parar áudio atual
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio = null;
            } catch (error) {
                // Ignorar erros de cleanup
            }
        }

        // Resetar estado
        this.isPlaying = false;
        this.isPaused = false;
    }

    // Private functions
    private loadSoundConfig(): void {
        this.soundConfig = {
            success: [
                { url: 'https://www.myinstants.com/media/sounds/correct.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/duolingo-correct.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/duolingo-completed-lesson.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/acertou-mizeravijk.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/acertouuu.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/correcto_Xgyp04B.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/correct-answer-new.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/what-bottom-text-meme-sanctuary-guardian-sound-effect-hd.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/vinheta-de-gol-do-fox-sports.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/ringtones-zelda-1.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/26f8b9_sonic_ring_sound_effect.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/mario-1up.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/pokemon-red_blue_yellow-level-up-sound-effect.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/pokemon-redblueyellow-item-found-hidden-sound-effect.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/the-goat-short.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/ffv-victory.mp3' },
            ],
            error: [
                { url: 'https://www.myinstants.com/media/sounds/error-song.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/errada.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/espanha.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/ninguem-acertou.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/duolingo-wrong.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/follow-the-dam-train-cj.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/sad-trombone_CTCquhN.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/wrong_5.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/wrong-answer-buzzer.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/windows-xp-error.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/errou-show-do-milhao.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/noo-anakin.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/naruto-sad-music-instant.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/tf_nemesis.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/miau-triste.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/tema-triste-toguro.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/game-over_rNHDd5K.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/spongebob-fail.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/fail-sound-effect.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/m_fixed_HjkcSnh.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/harry-potter-themesong-fail-recorder-cover-mp3cut_QBX88I0.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/roblox-death-sound-effect.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/gta-v-wasted-death-sound.mp3' },
                { url: 'https://www.myinstants.com/media/sounds/mario-world-life-lost.mp3' },
            ],
            custom: new Map<string, HTMLAudioElement>(),
            gameSounds: new Map<string, HTMLAudioElement>([
                ['quem-e-esse-pokemon', new Audio('https://www.myinstants.com/media/sounds/quem-e-esse-pokemon-011.mp3')],
                ['reginaldo-hora-do-lanche', new Audio('https://www.myinstants.com/media/sounds/reginald-hora-do-lanche.mp3')],
                ['verdades-absurdas', new Audio('https://www.myinstants.com/media/sounds/ronaldinho-gaucho-xaveca-reporter-na-vespera-do-dia-da-mulher.mp3')],
                ['painelistas-excentricos', new Audio('https://www.myinstants.com/media/sounds/chaves-o-bolo-1979.mp3')],
                ['ovo-ou-galinha', new Audio('https://www.myinstants.com/media/sounds/telecurso-2000-tema-musical-final-creditos-1.mp3')],
                ['noticias-extraordinarias', new Audio('https://www.myinstants.com/media/sounds/jornal-nacional-short.mp3')],
                ['dicionario-surreal', new Audio('https://www.myinstants.com/media/sounds/a-de-amor-xuxa.mp3')],
                ['caro-pra-chuchu', new Audio('https://www.myinstants.com/media/sounds/money-money-money-abba.mp3')],
                ['maestro-billy', new Audio('https://www.myinstants.com/media/sounds/loucura-loucura-caldeirao.mp3')]
            ])
        };
    }

    // Função centralizada para tocar áudio com overloads
    private playAudio(audio: HTMLAudioElement): void;
    private playAudio(soundItem: SoundItem): void;
    private playAudio(input: HTMLAudioElement | SoundItem): void {
        if (this.isDestroyed) return;

        try {
            let audio: HTMLAudioElement;

            if (input instanceof HTMLAudioElement) {
                // Caso 1: Recebeu HTMLAudioElement diretamente
                audio = input;
            } else {
                // Caso 2: Recebeu SoundItem (com url e audio opcional)
                if (input.audio) {
                    audio = input.audio;
                    audio.currentTime = 0;
                } else {
                    // Criar novo Audio e salvar para reutilização
                    audio = new Audio(input.url);
                    input.audio = audio;
                }
            }

            // Verificar se o áudio está pausado e não está tocando
            if (audio.paused && !this.isPlaying && !this.playPromise) {
                // Configurar volume e resetar para início
                audio.volume = 0.7;
                audio.currentTime = 0;

                // Salvar referência ao áudio atual
                this.currentAudio = audio;

                // Configurar event listeners para controle de estado
                this.setupAudioEventListeners(audio);

                // Tocar o áudio e armazenar a promise
                this.playPromise = audio.play();
                this.playPromise
                    .then(() => {
                        if (!this.isDestroyed) {
                            this.isPlaying = true;
                            this.isPaused = false;
                            this.playPromise = null;
                        }
                    })
                    .catch((error) => {
                        if (!this.isDestroyed) {
                            // Ignorar AbortError (interrupção normal)
                            if (error.name !== 'AbortError') {
                                console.error('Erro ao tocar áudio:', error);
                            }
                            this.isPlaying = false;
                            this.isPaused = false;
                            this.playPromise = null;
                        }
                    });
            }

        } catch (error) {
            console.error('Erro ao tocar áudio:', error);
        }
    }

    // Função para obter som aleatório de uma propriedade específica
    private getRandomSound(property: 'success' | 'error'): SoundItem | null {
        if (this.isDestroyed) return null;

        const sounds = this.soundConfig[property];

        if (sounds.length === 0) {
            console.warn(`Nenhum som de ${property} configurado`);
            return null;
        }

        const randomIndex = Math.floor(Math.random() * sounds.length);
        return sounds[randomIndex];
    }

    // Configurar event listeners para controle de estado do áudio
    private setupAudioEventListeners(audio: HTMLAudioElement): void {
        // On audio playing
        audio.onplaying = () => {
            if (!this.isDestroyed) {
                this.isPlaying = true;
                this.isPaused = false;
            }
        };

        // On audio pause
        audio.onpause = () => {
            if (!this.isDestroyed) {
                this.isPlaying = false;
                this.isPaused = true;
            }
        };

        // On audio ended
        audio.onended = () => {
            if (!this.isDestroyed) {
                this.isPlaying = false;
                this.isPaused = false;
                this.currentAudio = null;
                this.playPromise = null;
            }
        };

        // On audio error
        audio.onerror = () => {
            if (!this.isDestroyed) {
                this.isPlaying = false;
                this.isPaused = false;
                this.currentAudio = null;
                this.playPromise = null;
            }
        };
    }
}

// Exportar instância singleton
export const soundManager = SoundManager.getInstance(); 