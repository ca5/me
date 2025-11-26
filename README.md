ca5.me
===========

## Google Drive連携設定 (画像ダウンロード用)

このプロジェクトでは、Next.jsのビルド時にGoogle Driveから画像を自動でダウンロードします。その際、プログラムがGoogle Driveに安全にアクセスするために、「サービスアカウント」という特別なアカウントを使用します。

以下の手順に従ってサービスアカウントを作成し、その認証情報をプロジェクトに設定してください。

### ステップ1：Google Cloudプロジェクトの選択または作成

1.  [Google Cloud Console](https://console.cloud.google.com/)にアクセスします。
2.  画面上部のプロジェクト選択ドロップダウンから、このサイトに関連付けるプロジェクトを選択します。もし適切なプロジェクトがなければ、「新しいプロジェクト」を作成してください。

### ステップ2：Google Drive APIの有効化

1.  左側のナビゲーションメニューから「APIとサービス」 > 「ライブラリ」を選択します。
2.  検索バーに「**Google Drive API**」と入力し、検索結果からそれを選択します。
3.  「有効にする」ボタンをクリックします。

### ステップ3：サービスアカウントの作成

1.  左側のナビゲーションメニューから「APIとサービス」 > 「認証情報」を選択します。
2.  「+ 認証情報を作成」をクリックし、「サービスアカウント」を選択します。
3.  **サービスアカウント名**を入力します（例: `static-site-image-downloader`）。
4.  「作成して続行」をクリックします。
5.  **ロールの選択**は不要です。「続行」をクリックします。
6.  **ユーザーへのこのサービスアカウントへのアクセスを許可**も不要です。「完了」をクリックします。

### ステップ4：サービスアカウントキー（JSONファイル）の作成と取得

1.  認証情報の一覧に、先ほど作成したサービスアカウントが表示されます。そのメールアドレス（`...@....iam.gserviceaccount.com`）を**コピーして控えておいてください**（ステップ5で使用します）。
2.  サービスアカウントの行をクリックし、「キー」タブを選択します。
3.  「鍵を追加」 > 「新しい鍵を作成」を選択します。
4.  キーのタイプとして「**JSON**」を選択し、「作成」をクリックします。
5.  JSONファイルが自動的にダウンロードされます。**このファイルは非常に重要なので、安全な場所に保管してください。絶対にGitリポジトリに含めないでください。**

### ステップ5：Google Driveフォルダの共有設定

1.  Google Driveで、画像をアップロードするフォルダ（GASスクリプトが設置されているスプレッドシートと同じフォルダ）を開きます。
2.  フォルダ名を右クリックし、「共有」を選択します。
3.  「ユーザーやグループと共有」の入力欄に、ステップ4で控えておいたサービスアカウントのメールアドレスを貼り付けます。
4.  権限が「閲覧者」になっていることを確認し、「送信」をクリックします。

### ステップ6：認証情報を環境変数として設定

#### ローカル開発環境

1.  `next-app`ディレクトリにある`.env.example`ファイルをコピーし、`.env.local`という名前のファイルを作成します。
2.  作成した`.env.local`ファイルを開き、ステップ4でダウンロードしたJSONキーファイルの中身**全体**を`GOOGLE_APPLICATION_CREDENTIALS_JSON`の値として貼り付けます。

```.env.local
GOOGLE_APPLICATION_CREDENTIALS_JSON='{ "type": "service_account", "project_id": ... }'
```

`.env.local`ファイルは`.gitignore`によってバージョン管理から除外されるため、認証情報がリポジトリにコミットされることはありません。

#### デプロイ環境 (Vercel, Netlifyなど)

各ホスティングサービスの管理画面から環境変数を設定してください。

##### GitHub Actions

現在のこのリポジトリのようにGitHub Actionsでビルドとデプロイを行う場合は、以下の手順で設定します。

1.  リポジトリのページで `Settings` > `Secrets and variables` > `Actions` を開きます。
2.  `Repository secrets` のセクションで `New repository secret` ボタンをクリックします。
3.  **Name** に `GOOGLE_APPLICATION_CREDENTIALS_JSON` と入力します。
4.  **Secret** の入力欄に、ステップ4でダウンロードしたサービスアカウントのJSONキーファイルの中身**全体**を貼り付けます。
5.  `Add secret` ボタンをクリックして保存します。

これにより、`.github/workflows/deploy.yml` のようなワークフローファイル内で、以下のようにシークレットを環境変数としてビルドステップに渡すことができるようになります。

```yaml
      - name: Deploy to GitHub Pages
        working-directory: ./next-app
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_JSON }}
        run: |
          git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${{ github.repository }}
          git config --global user.name "${{ github.actor }}"
          git config --global user.email "${{ github.actor }}@users.noreply.github.com"
          pnpm run deploy
```

##### その他のホスティングサービス (Vercel, Netlifyなど)

-   **環境変数名**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
-   **値**: ステップ4でダウンロードしたJSONファイルの中身**全体**を、改行などを削除せずそのままコピーして貼り付けます。

以上の設定が完了すると、ローカルでの`pnpm build`やデプロイ時に、プログラムがサービスアカウントとしてGoogle Drive APIを認証し、共有されたフォルダから画像を安全にダウンロードできるようになります。
