; Direção de pré-processador: Define o NSIS para usar Unicode (UTF-8) para caracteres especiais
Unicode True

; Inclui o Modern UI (MUI) para uma interface de instalador mais amigável
!include "MUI2.nsh" ; Use MUI2.nsh para a versão mais recente do MUI

; --- INFORMAÇÕES BÁSICAS DO INSTALADOR ---
Name "Minecraft (Copia)" ; Nome que aparecerá no instalador e no Painel de Controle
OutFile "C:\Users\55319\Documents\Site\Downloads\MinecraftCopia_Setup.exe" ; Caminho e nome do arquivo .exe do seu instalador de saída
InstallDir "$PROGRAMFILES\SauloLabs\Minecraft (Copia)" ; Pasta de instalação padrão no computador do usuário

CRCCheck on ; Verifica a integridade do arquivo
SetCompressor lzma ; Usa o algoritmo de compactação LZMA para arquivos menores

; --- PÁGINAS DO INSTALADOR ---
; Configura as páginas padrão do MUI para seleção de diretório e progresso
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

; Define o texto do rodapé do instalador (opcional)
; !define MUI_FINISHPAGE_NOAUTOCLOSE

; Configura a página de finalização da instalação (opcional)
; !insertmacro MUI_PAGE_FINISH

; Define as linguagens suportadas pelo instalador
!insertmacro MUI_LANGUAGE "PortugueseBR"

; --- SEÇÃO PRINCIPAL: O QUE SERÁ INSTALADO ---
Section "Instalar Minecraft (Copia)"

    SetOutPath "$INSTDIR" ; Define o diretório de destino para os arquivos no computador do usuário

    ; Copia todos os arquivos e subpastas da sua pasta de origem.
    ; CERTIFIQUE-SE QUE ESTE CAMINHO É EXATO NO SEU COMPUTADOR:
    File /r "C:\Users\55319\Documents\Site\Downloads\Minecraft (Copia)\*.*"

    ; Cria um diretório para o programa no Menu Iniciar
    CreateDirectory "$SMPROGRAMS\SauloLabs"

    ; Cria o atalho do jogo no Menu Iniciar
    CreateShortCut "$SMPROGRAMS\SauloLabs\Minecraft (Copia).lnk" "$INSTDIR\MinecraftCopia.exe"

    ; Cria o atalho do jogo na Área de Trabalho
    CreateShortCut "$DESKTOP\Minecraft (Copia).lnk" "$INSTDIR\MinecraftCopia.exe"

SectionEnd

; --- SEÇÃO DE DESINSTALAÇÃO: Permite que o usuário remova o programa ---
Section "Uninstall"

    ; Exclui o atalho da Área de Trabalho
    Delete "$DESKTOP\Minecraft (Copia).lnk"

    ; Exclui o atalho do Menu Iniciar
    Delete "$SMPROGRAMS\SauloLabs\Minecraft (Copia).lnk"

    ; Remove o diretório do programa no Menu Iniciar se estiver vazio
    RMDir "$SMPROGRAMS\SauloLabs"

    ; Remove os arquivos principais do jogo
    Delete "$INSTDIR\MinecraftCopia.exe"
    Delete "$INSTDIR\UnityPlayer.dll"

    ; Remove a pasta de dados do jogo e seu conteúdo
    RMDir /r "$INSTDIR\MinecraftCopia_Data"

    ; Remove o diretório de instalação do jogo se estiver vazio
    RMDir "$INSTDIR"

    ; Remove a entrada do programa no Painel de Controle (Adicionar/Remover Programas)
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Minecraft (Copia)"

SectionEnd