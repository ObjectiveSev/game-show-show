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
}

export class SoundManager {
    private static instance: SoundManager;
    private soundConfig!: SoundConfig;

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
                // Sons de sucesso - Game Show e Acertos
                { url: 'https://www.myinstants.com/media/sounds/correct.mp3' }, // correct-answer-gameshow
                { url: 'https://www.myinstants.com/media/sounds/duolingo-correct.mp3' }, // duolingo-correct-95922
                { url: 'https://www.myinstants.com/media/sounds/duolingo-completed-lesson.mp3' }, // duolingo-completed-lesson-48481
                { url: 'https://www.myinstants.com/media/sounds/acertou-mizeravijk.mp3' }, // acerto-mizeravi
                { url: 'https://www.myinstants.com/media/sounds/ninguem-acertou.mp3' }, // ninguem-acertou-faustao
                { url: 'https://www.myinstants.com/media/sounds/acertouuu.mp3' }, // acertouuu-87771
                { url: 'https://www.myinstants.com/media/sounds/correcto_Xgyp04B.mp3' }, // correct556-98493
                { url: 'https://www.myinstants.com/media/sounds/correct-answer-new.mp3' }, // correct-answer-new-24687
                { url: 'https://www.myinstants.com/media/sounds/what-bottom-text-meme-sanctuary-guardian-sound-effect-hd.mp3' }, // what-bottom-text-meme-sanctuary-guardian-s-24591
                { url: 'https://www.myinstants.com/media/sounds/follow-the-dam-train-cj.mp3' }, // follow-the-dam-train-cj-34809
                { url: 'https://www.myinstants.com/media/sounds/vinheta-de-gol-do-fox-sports.mp3' }, // vinheta-de-gol-do-fox-sports
            ],
            error: [
                // Sons de erro - Game Show e Erros
                { url: 'https://www.myinstants.com/media/sounds/error-song.mp3' }, // error-song-32542
                { url: 'https://www.myinstants.com/media/sounds/errada.mp3' }, // voce-errou
                { url: 'https://www.myinstants.com/media/sounds/espanha.mp3' }, // espanha-errou
                { url: 'https://www.myinstants.com/media/sounds/duolingo-wrong.mp3' }, // duolingo-wrong-12298
                { url: 'https://www.myinstants.com/media/sounds/sad-trombone_CTCquhN.mp3' }, // sad-trumpet-59895
                { url: 'https://www.myinstants.com/media/sounds/wrong_5.mp3' }, // wrong-answer-gameshow
                { url: 'https://www.myinstants.com/media/sounds/wrong-answer-buzzer.mp3' }, // wrong-answer-buzzer-6983
                { url: 'https://www.myinstants.com/media/sounds/windows-xp-error.mp3' }, // windows-xp-error-100000
            ]
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
}

// Exportar instância singleton
export const soundManager = SoundManager.getInstance(); 