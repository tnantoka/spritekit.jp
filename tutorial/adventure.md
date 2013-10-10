---
layout: tutorial
title: adventure
---

Sprite Kitを使うと、いったいどんなゲームが作れるのでしょうか。
それを知るためには実際動作しているサンプルを見るのが一番です。

Appleが*Adventure*というゲームを公開していますので、本章ではそれを動かしてみましょう。

[code:Explained Adventure](https://developer.apple.com/library/ios/documentation/GraphicsAnimation/Conceptual/CodeExplainedAdventure/AdventureArchitecture/AdventureArchitecture.html)のIntroductionページ内の`Download Project`、または、ヘッダ上の`Companion File`からプロジェクトをダウンロードします。 

ダウンロードした*Adventure.zip*を展開し、*Adventure.xcodeproj*を開きます。

デフォルトでは、ターゲットが`Adventure`、デバイスが`My Mac 64-bit`になっているので、それぞれ`Adventure iOS`、`iPhone Retina (3.5-inch)`[^1]に変更して、実行[^2]します。
{% include image.html path="tutorial/adventure/target" caption="ターゲットとデバイスの設定" %}

アプリが起動すると、以下のようなタイトル画面が表示されます。
{% include image.html path="tutorial/adventure/title" caption="タイトル画面" %}

`ARCHER`か`WARRIOR`を選択するとプレイできます。フィールドをタップで移動、敵をタップで攻撃します。
{% include image.html path="tutorial/adventure/play" caption="ARCHERで攻撃" %}

Sprite Kitでは、このような本格的なゲームも開発することが可能です。

それでは、次章からは実際にSprite Kitでの開発に触れていきましょう。

[^1]: 任意のデバイスを選択してください。
[^2]: `⌘R`が便利です。停止は`⌘.`。
