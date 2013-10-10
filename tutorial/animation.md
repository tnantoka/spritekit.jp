---
layout: tutorial
title: animation
---

前章の通り、SKSpriteNodeを使えば静止画像を簡単に表示できますが、それだけではゲームは表現できません。
この章では**SKAction**をによって、スプライトをアニメーションさせる方法を紹介します。

まずは、これまでの要領でプロジェクトを作成し、`SJAnimationScene`を追加します。
そして、左下に剣のスプライトを配置し、アニメーションさせる際にノードを特定できるよう、`name`を指定します。

{% highlight objc %}
- (void)createSceneContents {
    SKSpriteNode *sword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    sword.position = CGPointMake(30.0f, 30.0f);
    sword.name = @"sword";
    [self addChild:sword];
}
{% endhighlight %}

{% include image.html path="tutorial/animation/sword" caption="剣を表示" %}

次に、`touchesBegan:withEvent:`の中で、アニメーションの設定をします。
タップされた位置へ移動するための**SKAction**のインスタンスを、`moveTo:duration:`メソッドで作り、ノードの`runAction:`に渡しています。

{% highlight objc %}
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch  = [touches anyObject];
    CGPoint location = [touch locationInNode:self];

    SKNode *sword = [self childNodeWithName:@"sword"];
    SKAction *moveToTouch = [SKAction moveTo:location duration:1.0f];
    [sword runAction:moveToTouch];
}
{% endhighlight %}

これでタップされた位置に剣が1秒間かけて移動するようになりました。
SKActionは他にも様々な種類があり、拡大・縮小や回転、フェードイン・アウト、音の再生までできます。

{% include image.html path="tutorial/animation/move" caption="タップで移動" ext="gif" %}

`runAction:completion:`を使えば、アニメーション完了時に任意の処理を行うこともできます。
以下のコードでは座標を`NSLog`で表示しています。

{% highlight objc %}
    [sword runAction:moveToTouch completion:^{
        NSLog(@"%@", NSStringFromCGPoint(location));
    }];
{% endhighlight %}

{% highlight sh %}
2013-09-20 20:53:45.133 SJAnimation[92159:a0b] {213.5, 357.9375}
2013-09-20 20:53:46.050 SJAnimation[92159:a0b] {231.5, 140.87498}
2013-09-20 20:55:29.056 SJAnimation[92159:a0b] {106.5, 369.4375}
{% endhighlight %}

### シーケンス

シーケンスを使えば、複数のアニメーションを連続して実行することも可能です。
以下は、1周回った後に画面から消えるサンプルです。
途中、右下で1秒間待っています。

{% highlight objc %}
    SKSpriteNode *sequenceSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    sequenceSword.position = CGPointMake(100.0f, 400.0f);
    [self addChild:sequenceSword];
    
    SKAction *moveRight = [SKAction moveByX:100.0f y:0 duration:1.0f];
    SKAction *moveDown = [SKAction moveByX:0 y:-100.0f duration:1.0f];
    SKAction *wait = [SKAction waitForDuration:0.5f];
    SKAction *moveLeft = [SKAction moveByX:-100.0f y:0 duration:1.0f];
    SKAction *moveUp = [SKAction moveByX:0 y:100.0f duration:1.0f];
    SKAction *remove = [SKAction removeFromParent];
   
    SKAction *sequence = [SKAction sequence:@[moveRight, moveDown, wait, moveLeft, moveUp, remove]];
    [sequenceSword runAction:sequence];
{% endhighlight %}

{% include image.html path="tutorial/animation/sequence" caption="シーケンス" ext="gif" %}

### グループ

同時に複数のアクションを適用することも可能です。
この例では、グループを使って、中央の剣をズームしながらフェードアウトさせています。

{% highlight objc %}
    SKSpriteNode *groupSword = [SKSpriteNode spriteNodeWithImageNamed:@"sword"];
    groupSword.position = CGPointMake(150.0f, 200.0f);
    [self addChild:groupSword];
    
    SKAction *zoom = [SKAction scaleBy:5.0 duration:3.0f];
    SKAction *fadeOut = [SKAction fadeOutWithDuration:3.0f];
    SKAction *group = [SKAction group:@[zoom, fadeOut]];
    
    [groupSword runAction:group];
{% endhighlight %}

{% include image.html path="tutorial/animation/group" caption="グループ" ext="gif" %}

### テクスチャ

SKSpriteNodeの使用する画像はSKTextureによって管理されています。
今まで意識していませんでしたが、`spriteNodeWithImageNamed:`の中で、SKTextureが作られています。

単純な利用ならこの方法でいいのですが、例えば同じ画像を何度も使う場合は、
一度テクスチャを作って、それを再利用してSpriteNodeを生成したほうがメモリ効率が良くなります。

またSKTextureとSKActionを組み合わせ使うと、パラパラ漫画のような表現も簡単にできます。
ここでは以下の画像から歩行のアニメーションを作ります。

{% include image.html path="tutorial/animation/clotharmor" caption="clotharmor.png" %}

{% include note.html title="note" body="複数枚の画像からアニメーションを作りたい場合は、テクスチャアトラスという機能を使うと簡単にひとまとめにして扱うことができます。既存の素材を利用する場合、今回のようにタイル上に並べてあるものが多いため、ここでは割愛します。" %}

実装例は以下のようになります。

先ほどの画像からSKTextureを作り、その一部分を切り取って複数枚のテクスチャを作っています。
こうすることで手間もメモリも節約できます。
なお、Rect指定は比率での指定になりますので、幅・高さで割るのを忘れないようにしましょう。

そして、作成したテクスチャの配列を一定時間で切り替えるSKActionを生成し、無限に繰り返すようにして`runAction:`に渡しています。[^1]

{% highlight objc %}
#define SIZE 96.0f

/* 省略 */

    int row = 1;
    SKTexture *clotharmor = [SKTexture textureWithImageNamed:@"clotharmor"];

    NSMutableArray *textures = @[].mutableCopy;
    for (int col = 0; col < 4; col++) {
        CGFloat x = col * SIZE / clotharmor.size.width;
        CGFloat y = row * SIZE / clotharmor.size.height;
        CGFloat w = SIZE / clotharmor.size.width;
        CGFloat h = SIZE / clotharmor.size.height;
        
        SKTexture *texture = [SKTexture textureWithRect:CGRectMake(x, y, w, h) inTexture:clotharmor];
        [textures addObject:texture];
    }
    SKSpriteNode *walker = [SKSpriteNode spriteNodeWithTexture:textures.firstObject];
    walker.position = CGPointMake(250.0f, 100.0f);
    [self addChild:walker];
    
    SKAction *walk = [SKAction animateWithTextures:textures timePerFrame:0.2f];
    SKAction *forever = [SKAction repeatActionForever:walk];
    [walker runAction:forever];

{% endhighlight %}

{% include image.html path="tutorial/animation/walk" caption="歩行" ext="gif" %}

このように、SKActionを利用すると、手軽にアニメーション表現を行うことができます。
ゲームの表現力向上に、是非活用してください。

[^1]: `animateWithTextures:timePerFrame`で作ったSKActionを実行すると、SKSpriteNode内のテクスチャが変更されるため、スプライト作成時には何を指定してもよいです。ここでは、サイズ指定の手間を省くため、`textures`の`firstObject`を指定しています。（スプライトのサイズは作成したままのため）
