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
    private static instance: SoundManager;
    private soundConfig!: SoundConfig;
    private currentAudio: HTMLAudioElement | null = null;

    private constructor() {
        this.loadSoundConfig();
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

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

    private playSound(type: SoundType): void {
        try {
            if (!this.soundConfig) {
                console.warn('Configuração de sons ainda não carregada');
                return;
            }

            const sounds = type === SoundType.SUCCESS ? this.soundConfig.success : this.soundConfig.error;

            if (sounds.length === 0) {
                console.warn(`Nenhum som configurado para ${type}`);
                return;
            }

            // Selecionar som aleatório
            const randomIndex = Math.floor(Math.random() * sounds.length);
            const soundItem = sounds[randomIndex];

            let audio: HTMLAudioElement;

            // Verificar se já temos o Audio pré-carregado
            if (soundItem.audio) {
                audio = soundItem.audio;
                // Resetar o áudio para o início antes de tocar
                audio.currentTime = 0;
            } else {
                // Criar novo Audio e salvar para reutilização
                audio = new Audio(soundItem.url);
                audio.volume = 0.7; // Volume em 70%
                soundItem.audio = audio;
            }

            // Tocar o áudio (sem await)
            audio.play().catch(error => {
                console.error(`Erro ao tocar som ${type}:`, error);
            });

        } catch (error) {
            console.error(`Erro ao tocar som ${type}:`, error);
        }
    }

    public playSuccessSound(): void {
        this.playSound(SoundType.SUCCESS);
    }

    public playErrorSound(): void {
        this.playSound(SoundType.ERROR);
    }

    public playCustomSound(url: string): void {
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
                audio.volume = 0.7; // Volume em 70%

                // Salvar para reutilização no map de custom sounds
                this.soundConfig.custom.set(url, audio);
            }

            // Salvar referência ao áudio atual
            this.currentAudio = audio;

            // Tocar o áudio
            audio.play().catch(error => {
                console.error(`Erro ao tocar som customizado:`, error);
            });

        } catch (error) {
            console.error(`Erro ao tocar som customizado:`, error);
        }
    }

    public stopCurrentSound(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }

    public playGameSound(gameId: string): void {
        try {
            // Verificar se o jogo tem som configurado no map
            const existingAudio = this.soundConfig.gameSounds.get(gameId);

            if (!existingAudio) {
                console.warn(`Nenhum som configurado para o jogo: ${gameId}`);
                return;
            }

            // Configurar volume e resetar para início
            existingAudio.volume = 0.7;
            existingAudio.currentTime = 0;

            // Tocar o áudio
            existingAudio.play().catch(error => {
                console.error(`Erro ao tocar som do jogo ${gameId}:`, error);
            });

        } catch (error) {
            console.error(`Erro ao tocar som do jogo ${gameId}:`, error);
        }
    }
}

// Exportar instância singleton
export const soundManager = SoundManager.getInstance(); 