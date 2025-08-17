#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createReadStream } from 'fs';
import { spawn } from 'child_process';

async function extractMP3Url(url) {
    try {
        console.log(`\n🔍 Extraindo MP3 de: ${url}`);

        // Usar curl para fazer a requisição HTTP
        const curlProcess = spawn('curl', ['-s', '-L', url]);

        let html = '';

        return new Promise((resolve, reject) => {
            curlProcess.stdout.on('data', (data) => {
                html += data.toString();
            });

            curlProcess.stderr.on('data', (data) => {
                console.error(`Erro no curl: ${data}`);
            });

            curlProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Curl process exited with code ${code}`));
                    return;
                }

                // Procurar por URLs de MP3 no HTML
                const mp3Regex = /https:\/\/[^"]*\.mp3/g;
                const mp3Urls = html.match(mp3Regex);

                if (mp3Urls && mp3Urls.length > 0) {
                    console.log(`✅ MP3 encontrado: ${mp3Urls[0]}`);
                    resolve(mp3Urls[0]);
                } else {
                    // Procurar por URLs que contenham "mp3" ou "audio"
                    const audioRegex = /https:\/\/[^"]*(?:mp3|audio)[^"]*/gi;
                    const audioUrls = html.match(audioRegex);

                    if (audioUrls && audioUrls.length > 0) {
                        console.log(`✅ Áudio encontrado: ${audioUrls[0]}`);
                        resolve(audioUrls[0]);
                    } else {
                        console.log(`❌ Nenhum link MP3 encontrado`);
                        resolve(null);
                    }
                }
            });
        });

    } catch (error) {
        console.error(`❌ Erro ao extrair MP3: ${error.message}`);
        return null;
    }
}

async function main() {
    const urls = [
        "https://www.myinstants.com/en/instant/error-song-32542/",
        "https://www.myinstants.com/en/instant/voce-errou/",
        "https://www.myinstants.com/en/instant/espanha-errou/",
        "https://www.myinstants.com/en/instant/correct-answer-gameshow/",
        "https://www.myinstants.com/en/instant/duolingo-correct-95922/",
        "https://www.myinstants.com/en/instant/duolingo-wrong-12298/",
        "https://www.myinstants.com/en/instant/duolingo-completed-lesson-48481/",
        "https://www.myinstants.com/en/instant/acerto-mizeravi/",
        "https://www.myinstants.com/en/instant/ninguem-acertou-faustao/",
        "https://www.myinstants.com/en/instant/acertouuu-87771/",
        "https://www.myinstants.com/en/instant/correct556-98493/",
        "https://www.myinstants.com/en/instant/correct-answer-new-24687/",
        "https://www.myinstants.com/en/instant/what-bottom-text-meme-sanctuary-guardian-s-24591/",
        "https://www.myinstants.com/en/instant/sad-trumpet-59895/",
        "https://www.myinstants.com/en/instant/wrong-answer-gameshow/",
        "https://www.myinstants.com/en/instant/wrong-answer-buzzer-6983/",
        "https://www.myinstants.com/en/instant/follow-the-dam-train-cj-34809/"
    ];

    console.log("🎵 Extrator de Links MP3 - Myinstants");
    console.log("=".repeat(50));

    const results = [];

    for (const url of urls) {
        const mp3Url = await extractMP3Url(url);
        if (mp3Url) {
            // Extrair o nome do som da URL
            const urlParts = url.split('/');
            const soundName = urlParts[urlParts.length - 2] || 'unknown';
            results.push({ originalUrl: url, mp3Url, soundName });
        }
        // Delay para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("\n" + "=".repeat(50));
    console.log("📋 RESUMO DOS RESULTADOS:");
    console.log("=".repeat(50));

    results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.soundName}`);
        console.log(`   Site: ${result.originalUrl}`);
        console.log(`   MP3: ${result.mp3Url}`);
    });

    if (results.length === 0) {
        console.log("❌ Nenhum link MP3 foi encontrado");
    }

    return results;
}

// Executar o script
main().catch(console.error); 