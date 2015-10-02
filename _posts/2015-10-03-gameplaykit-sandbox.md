---
layout: post
title:  "ゲームロジック用フレームワーク「GameplayKit」のサンプルを作成しました"
categories: update
author: tnantoka
---

tvOS向けに何か作れないかなぁとドキュメントを眺めていたら、

[DemoBots: Building a Cross Platform Game with SpriteKit and GameplayKit](https://developer.apple.com/library/prerelease/tvos/samplecode/DemoBots/Introduction/Intro.html)

> DemoBots is a fully-featured 2D game built with SpriteKit and GameplayKit

なる記載が。
ん？`GameplayKit`ってなんだ？？

調べてみるとゲームのロジック部分を書きやすくしてくれるフレームワークらしい。
今年はWWDCとかの情報全然追えてなくて知らなかった。

ちょっとドキュメント読んでみたけど、すぐには理解できる気がしなかったので、サンプルを作ってみることに。

[GameplayKit](https://developer.apple.com/library/ios/documentation/General/Conceptual/GameplayKit_Guide/)には7つの主要な要素があるため、その1つずつにサンプルを作成しています。  
以下がその一覧と簡単な説明です。

ソースコードは[tnantoka/GameplayKitSandbox](https://github.com/tnantoka/GameplayKitSandbox)で公開しています。

## Randomization

ランダムな数値を得るためのUtility。

ランダム度合いとパフォーマンスの違う3つのRandomSourceがある。  
取得する数値のばらつきが違うDistributionも3つ用意されてる。  
よく使うと思われるサイコロ用には`GKRandomDistribution.d6()`等も。  

サンプルでは各SourceとDistributionを使って取得したランダムな数値を元に、点を円状に並べています。

{% include image.html path="posts/gameplaykit-sandbox/randomization" caption="Randomization" %}

今考えると、円の半径が違って微妙にわかりづらい…

## Entities and Components

[game - オブジェクト指向でゲームを作るのをやめよう - Qiita](http://qiita.com/tshinsay/items/739ad875cc3925d51f12) で言及されているような、コンポーネント指向でゲームを作る仕組みです。

サンプルでは、

- 表示
- 攻撃（回転するだけ）
- ユーザー操作
- AI（ランダムに移動するだけ）

の4つのコンポーネントを用意して、プレイヤー・敵・ボスにそれぞれ必要なものを割り当てています。

{% include image.html path="posts/gameplaykit-sandbox/entities" caption="Entities and Components" %}

## State Machines

ステートマシーンです。状態遷移を簡単に管理できます。  
サンプルでは、家のオブジェクトに対して

- 乾いている
- 燃えている
- 濡れている

の3つの状態を用意しています。  
また、「濡れている時は燃えない」という条件を`isValidNextState`で実装しています。

{% include image.html path="posts/gameplaykit-sandbox/state" caption="State Machines" %}

## The Minmax Strategist

[ミニマックス法](https://ja.wikipedia.org/wiki/%E3%83%9F%E3%83%8B%E3%83%9E%E3%83%83%E3%82%AF%E3%82%B9%E6%B3%95)を実装しやすくしてくれる仕組みです。

サンプルはマルバツゲームで、相手のリーチの数が多くなるとスコアが低くなるようにしています。  
（なのでAIはこちらのリーチがなるべく少なくなるように動きます）

{% include image.html path="posts/gameplaykit-sandbox/minmax" caption="The Minmax Strategist" %}

## Pathfinding

障害物を避けて通る、迷路を抜けて出口に向かうなどの経路探索が簡単に実装できます。  
サンプルでは障害物を避けて、ターゲットに向けてボールを飛ばしています。  
（Pathfindingによって見つけたPathに赤い線を引いてます。）

{% include image.html path="posts/gameplaykit-sandbox/pathfinding" caption="Pathfinding" %}

## Agents, Goals, and Behaviors

自律的に動くオブジェクトを実装しやすくする仕組みです。  
サンプルではランダムな動きをするターゲットを、他のオブジェクトが追いかける動きをしています。

{% include image.html path="posts/gameplaykit-sandbox/agents" caption="Agents, Goals, and Behaviors" %}

## Rule Systems

予めルールを設定しておき、現在のゲームの状態がそのルールにマッチするか判定する仕組みです。  
サンプルは、お掃除ロボットにしました。  
充電残量が30%以下になるか、充電器から離れすぎると充電しに行くルールで動いています。

{% include image.html path="posts/gameplaykit-sandbox/rule" caption="Rule Systems" %}

## 参考文献

- [Introducing GameplayKit - WWDC 2015 - Videos - Apple Developer](https://developer.apple.com/videos/wwdc/2015/?id=608)
- [Deeper into GameplayKit with DemoBots - WWDC 2015 - Videos - Apple Developer](https://developer.apple.com/videos/wwdc/2015/?id=609)
- [GKMinmaxStrategist: How to build a TicTacToe AI](http://tilemapkit.com/2015/07/gkminmaxstrategist-build-tictactoe-ai/)

## 感想

実際触ってみたら、ドキュメント読んでるだけの時よりだいぶわかった気がした。  
ただ、ComponentsやState、Agents、Rule Systemあたりは役割分担やクラスの分け方など、使いこなすには経験が必要そう。


