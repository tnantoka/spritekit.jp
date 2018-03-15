---
layout: post
title:  "sceneDidLoad()を知らなかった…"
categories: etc
author: tnantoka
---

2018年3月1日〜2日にtry! Swift TOKYO 2018が開催されました。

<https://www.tryswift.co/events/2018/tokyo/jp/>

僕は残念ながら参加できなかったのですが、giginetさんによるSpriteKitの講演があり、SpriteKitファンとして楽しみにしていました。

<script async class="speakerdeck-embed" data-id="9bfa907e324643bfa256ea40380d71f5" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

聞き起こしは以下で閲覧できます。（後日講演の動画も公開されるはずです）

<http://niwatako.hatenablog.jp/entry/2018/03/01/172744>

SpriteKitの概要を掴むには良いと思いますので、これから触ってみるという方は是非ご覧ください。

それでは、本題です。

スライドの中で`sceneDidLoad()`というメソッドが出てきました。  
「え？`UIViewController`の`viewDidLoad()`的なもの？？そんな便利なものあったの？」とびっくりました。

ドキュメントを見ると確かにありました！

<https://developer.apple.com/documentation/spritekit/skscene/1645216-scenedidload>

> iOS 10.0+

iOS 10から追加されていたようです。気付かずにずっと`didMove(to:)`を使い続けていました…。  
（こちらはiOS 7からある）

今度からSceneの読み込み直後に行ないたい処理はdidLoadを使おうと思います。
