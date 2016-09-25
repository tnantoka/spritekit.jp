---
layout: post
title:  "SpriteKit, GameplayKitのiOS 10新機能つまみ食い"
categories: etc
author: tnantoka
---

遅ればせながら、WWDC 2016の

- [What's New in SpriteKit](https://developer.apple.com/videos/play/wwdc2016/610/)
- [What's New in GameplayKit](https://developer.apple.com/videos/play/wwdc2016/608/)

を見ました。  
プログラミングガイドが更新されないので、正式リリース後も概要を掴むにはWWDCの情報が頼りです。

その中で気になった、

- SKTileMapNode
- SKWarpGeometryGrid
- GKNoise

の3つを無理やり組み合わせて使ってみました。

{% include image.html path="posts/what-s-new-in-spritekit-on-ios-10" ext="gif" caption="What's New in SpriteKit on iOS 10" %}

- マップを描画してるのが`SKTileMapNode`
- 移動の時に円の形を変えてるのが`SKWarpGeometryGrid`
- 周囲に壁のようなものが`GKNoise`

です。

ソースコードはこちらです。

<https://github.com/tnantoka/What-s-New-in-SpriteKit-on-iOS-10>

GKNoiseについては、[GameplayKitSandbox](https://github.com/tnantoka/GameplayKitSandbox)にも後日サンプルを追加する予定です。
