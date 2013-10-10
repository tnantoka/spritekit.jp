---
layout: tutorial
title: scene
---

**SKScene**はゲームの1画面に相当します。フィールドや戦闘・ステージ別など必要に応じてシーンを作成し、それをSKViewに表示させることで、Sprite Kitのゲームは作り上げられていきます。
今までもいくつかシーンは作成してきましたが、ここではもう少し詳しく見てみましょう。

### ループ

シーンが描画されるとき、Sprite Kitの内部では、以下の様な流れで処理が行われます。

{% include image.html path="tutorial/scene/loop" caption="1フレームの処理" %}

これで1フレームが終わります。
60FPSなら1秒間に60回繰り返され、ゲームが進んでいきます。

独自処理を組み込む箇所は、

1. update: 
2. didEvaluateActions 
3. didSimulatePhysics

の3つのメソッドです。

1は毎フレームの最初に呼ばれます。共通の前処理など、最も利用することが多いでしょう。

2・3はアクション・物理演算[^1]の処理が終わった後に呼び出されます。Sprite Kitによる処理が終わった後、独自にノードを操作したい場合等に利用します。

以下のようにそれぞれのメソッドでNSLogしてみると、順番通り呼び出されているのがわかります。[^2]

{% highlight objc %}
- (void)update:(NSTimeInterval)currentTime {
    NSLog(@"1: update:");
}

- (void)didEvaluateActions {
    NSLog(@"2: updidEvaluateActionsdate");
}

- (void)didSimulatePhysics {
    NSLog(@"3: updidEvaluateActionsdate");
}
{% endhighlight %}

{% highlight sh %}
2013-09-25 22:48:15.798 SJScene[94451:a0b] 1: update:
2013-09-25 22:48:15.799 SJScene[94451:a0b] 2: updidEvaluateActions
2013-09-25 22:48:15.799 SJScene[94451:a0b] 3: updidEvaluatePhysics
{% endhighlight %}

### 深さと描画順

シーンに追加された各ノードは、後に追加されたものほど手前に存在することになります。
以下の例だと、最後に追加された`blue`が一番上に描画されます。

{% highlight objc %}
    SKSpriteNode *red = [SKSpriteNode spriteNodeWithColor:[SKColor redColor] size:CGSizeMake(50.0f, 50.0f)];
    red.position = CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame));
    [self addChild:red];

    SKSpriteNode *green = [SKSpriteNode spriteNodeWithColor:[SKColor greenColor] size:CGSizeMake(50.0f, 50.0f)];
    green.position = CGPointMake(CGRectGetMidX(self.frame) + 10.0f, CGRectGetMidY(self.frame) - 10.0f);
    [self addChild:green];

    SKSpriteNode *blue = [SKSpriteNode spriteNodeWithColor:[SKColor blueColor] size:CGSizeMake(50.0f, 50.0f)];
    blue.position = CGPointMake(CGRectGetMidX(self.frame) - 10.0f, CGRectGetMidY(self.frame) - 20.0f);
    [self addChild:blue];
{% endhighlight %}

{% include image.html path="tutorial/scene/order" caption="addChild:された順に表示" %}

描画順を変えたい場合、`addChild:`の代わりに、`insertChild:atIndex:`を使って順番を調整することで対応できますが、
いつもその方法が取れるとは限りません。

そこで、`zPosition`というプロパティを使えば、Nodeツリー上の順番と関係なく、描画順を変更することができます。
zPoistionが小さい順に描画されるため、以下の例では、初期値の**0**である`cyan`、**1**が設定された`magenta`、**2**が設定された`yellow`の順に表示されます。

{% highlight objc %}
    SKSpriteNode *magenta = [SKSpriteNode spriteNodeWithColor:[SKColor magentaColor] size:CGSizeMake(50.0f, 50.0f)];
    magenta.position = CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame) + 100.0f);
    magenta.zPosition = 1.0f;
    [self addChild:magenta];
    
    SKSpriteNode *yellow = [SKSpriteNode spriteNodeWithColor:[SKColor yellowColor] size:CGSizeMake(50.0f, 50.0f)];
    yellow.position = CGPointMake(CGRectGetMidX(self.frame) + 10.0f, CGRectGetMidY(self.frame) + 100.0f - 10.0f);
    yellow.zPosition = 2.0f;
    [self addChild:yellow];
    
    SKSpriteNode *cyan = [SKSpriteNode spriteNodeWithColor:[SKColor cyanColor] size:CGSizeMake(50.0f, 50.0f)];
    cyan.position = CGPointMake(CGRectGetMidX(self.frame) - 10.0f, CGRectGetMidY(self.frame) + 100.0f - 20.0f);
    [self addChild:cyan];
{% endhighlight %}

{% include image.html path="tutorial/scene/zposition" caption="zpositionの小さい順に表示" %}

### ノードの検索

特定のノードを後から操作したいことがあります。
その場合、シーンのインスタンス変数として保持する必要があるのでしょうか。
もちろん、それも可能ですが、Sprite Kitにはノードに名前をつけて、それをもとに検索する機能があります。

以下では、画面をタップする度に、ノードを検索して、操作しています。
名前に`white1`が設定された左端の矩形は、タップの度に縮小、`whites`が設定された右3つの矩形は、タップの度に回転します。
このように、`childNodeWithName:`では1つ、`enumerateChildNodesWithName:usingBlock:`では複数のノードを検索できます。

{% highlight objc %}
    SKSpriteNode *white = [SKSpriteNode spriteNodeWithColor:[SKColor whiteColor] size:CGSizeMake(50.0f, 50.0f)];
    white.position = CGPointMake(65.0f, 70.0f);
    white.name = @"white1";
    [self addChild:white];

    for (int i = 2; i < 5; i++) {
        SKSpriteNode *white = [SKSpriteNode spriteNodeWithColor:[SKColor whiteColor] size:CGSizeMake(50.0f, 50.0f)];
        white.position = CGPointMake(65.0f * i, 70.0f);
        white.name = @"whites";
        [self addChild:white];
    }

/* 省略 */

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    if (touches.count == 1) {
        [self childNodeWithName:@"white1"].yScale *= 0.9f;
        [self enumerateChildNodesWithName:@"whites" usingBlock:^(SKNode *node, BOOL *stop) {
            node.zRotation += -5.0f * M_PI / 180.0f;
        }];
    } 
}
{% endhighlight %}

{% include image.html path="tutorial/scene/name" caption="ノードを検索して変更" %}

### 画面の切り替え

一般的にゲームは、タイトル画面、ゲーム画面、設定画面など複数の画面で構成されています。
Sprite Kitではその画面ごとにSKSceneを作って、SKView上で切り替えて表示することになります。

それでは、2つ目の画面を作って、切り替えてみましょう。

#### SJFirstScene.m

{% highlight objc %}
#import "SJSecondScene.h"

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    /* 省略 */

    else if (touches.count == 2) {
        SKTransition *push = [SKTransition pushWithDirection:SKTransitionDirectionLeft duration:2.0f];
        SJSecondScene *second = [SJSecondScene sceneWithSize:self.size];
        second.prevScene = self;
        [self.view presentScene:second transition:push];
    }
}
{% endhighlight %}

#### SJSecondScene.h

{% highlight objc %}
@property (nonatomic) SKScene *prevScene;
{% endhighlight %}

#### SJSecondScene.m

{% highlight objc %}

- (void)createSceneContents {
    self.backgroundColor = [SKColor lightGrayColor];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    SKTransition *door = [SKTransition doorwayWithDuration:2.0f];
    [self.view presentScene:_prevScene transition:door];
}
{% endhighlight %}

`SJFirstScene`では2本指でタップ[^3]されると、`SJSecondScene`のインスタンスを作り、
Pushトランジションを使ってSKViewに表示しています。
また、`SJSecondScene`には前回画面を保持するプロパティ`prevScene`が追加されており、そこに自分自身を設定しています。
SKViewに表示されなくなったシーンは参照が削除されるので、再利用したい場合はどこかで保持しておかないと開放されてしまいます。
今回はSJSecondSceneにその役目を持たせています。

これで以下のように2つのシーンを行き来できます。

{% include image.html path="tutorial/scene/push" caption="First → Second" %}
{% include image.html path="tutorial/scene/door" caption="First ← Second" %}

SJFirstSceneを再利用しているため、タップで回転させた白のノードが、戻ってきた画面でも回転したままなのがわかります。

Sprite Kitでは、このように独自のシーンを組みわせてゲームを作っていきます。

[^1]: 重力や衝突等、ノードを物理法則に従わせるための演算。Sprite Kitには標準でこの機能が組み込まこまれています。後の章で紹介します。
[^2]: 大量のログが出力されるので、注意してください。
[^3]: シミュレータではOption + タップです。

