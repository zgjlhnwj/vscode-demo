import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 注册侧边栏 WebView
    const provider = new LeleCodeAiViewProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('lele-code-ai-sidebar', provider)
    );

    // 保留命令注册，作为备用打开方式
    let disposable = vscode.commands.registerCommand('lele-code-ai.openCodeAi', () => {
        const panel = vscode.window.createWebviewPanel(
            'leleCodeAi',
            'LeleCodeAi',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

class LeleCodeAiViewProvider implements vscode.WebviewViewProvider {
    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = getWebviewContent();
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LeleCodeAi</title>
        <style>
            body {
                padding: 10px;
            }
            .container {
                display: flex;
                flex-direction: column;
                height: 100vh;
            }
            .chat-area {
                flex: 1;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                padding: 10px;
                overflow-y: auto;
            }
            .input-area {
                display: flex;
                gap: 10px;
            }
            textarea {
                flex: 1;
                min-height: 60px;
                resize: vertical;
            }
            button {
                padding: 5px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="chat-area" id="chatArea">
                <div>欢迎使用 LeleCodeAi</div>
            </div>
            <div class="input-area">
                <textarea id="userInput" placeholder="输入你的问题..."></textarea>
                <button onclick="sendMessage()">发送</button>
            </div>
        </div>
        <script>
            function sendMessage() {
                const input = document.getElementById('userInput');
                const chatArea = document.getElementById('chatArea');
                
                if (input.value.trim()) {
                    chatArea.innerHTML += '<div><strong>You:</strong> ' + input.value + '</div>';
                    input.value = '';
                }
            }
        </script>
    </body>
    </html>`;
}

export function deactivate() {} 