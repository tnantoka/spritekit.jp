---
layout: post
title:  "物理エンジンを使ってお店の中を歩"
categories: rpg
author: tnantoka
---

今回は、キャラクターをマップ内で歩かせてみます。

以下が完成イメージです。
ややぎこちないですが、リアルタイムバトルをやるわけでもないので、よしとします。

{% include image.html path="posts/shop-walking" ext="gif" caption="お店の中を歩く" %}

通行状態とプレイヤーの位置を設定するために、マップデータにレイヤーを追加しています。

{% highlight sh %}
x,x,x,x,x,x,x,x,x,x
x,x,x,x,x,x,x,x,x,x
x,x,x,x,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,o,o,o,o,o,o,x,x
x,x,x,x,o,o,x,x,x,x
x,x,x,x,o,o,x,x,x,x

-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,p,-,-,-,-,-
{% endhighlight %}

`o`は通行可で何もしません。`x`は通行不可なので、phsyicsBodyを設定したSKNodeを配置します。  
`p`がプレイヤーの場所でphysicsBodyを指定したNodeを配置します。`-`は何もなしです。

以下がその部分のコード抜粋です。

{% highlight objc %}
if ([col isEqualToString:@"o"]) continue;
if ([col isEqualToString:@"-"]) continue;

SKNode *tileSprite;

if ([col isEqualToString:@"x"]) {
    tileSprite = SKNode.new;
    
    tileSprite.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:CGSizeMake(TILE_SIZE, TILE_SIZE)];
    tileSprite.physicsBody.dynamic = NO;
    
} else if ([col isEqualToString:@"p"]) {
    tileSprite = [SJCharacterNode characterNode];
    tileSprite.name = kPlayerName;

    tileSprite.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:CGSizeMake(TILE_SIZE, TILE_SIZE)];
    tileSprite.physicsBody.affectedByGravity = NO;
    tileSprite.physicsBody.allowsRotation = NO;
    
}
{% endhighlight %}

なお、今回から、マップの処理をSJMapNodeという専用クラスに任せるように変更しています。
上のコードもSJMapNode内のものです。

プレイヤーは新たに追加したSJCharacterNodeを使っています。
アニメーションはチュートリアルのサンプルゲームとほぼ同じロジックなので、ここでは移動の処理を抜粋します。

といっても、特に特別なことはやっておらす、画面がタップされたら、x軸・y軸の順でその方向を向いて歩いていくだけです。移動はタイルサイズ（32px）の単位で行なうにしています。

アニメーションはもちろんSKActionを利用。  
また、物理エンジンの衝突を利用することで、通行状態を考慮する必要がく、コードがシンプルになっています。[^1]

{% highlight objc %}
- (void)moveTo:(CGPoint)location {
    
    NSMutableArray *actions = @[].mutableCopy;
    CGPoint diff = CGPointMake(floor((location.x - self.position.x) / TILE_SIZE), floor((location.y - self.position.y) / TILE_SIZE));
    
    CGFloat x = diff.x * TILE_SIZE;
    CGFloat y = diff.y * TILE_SIZE;
    
    SKAction *moveX = [SKAction moveByX:x y:0 duration:abs(diff.x) * SPEED];
    SKAction *moveY = [SKAction moveByX:0 y:y duration:abs(diff.y) * SPEED];
    
    SKAction *walk = [SKAction runBlock:^{
        [self walk];
    }];
    SKAction *stop = [SKAction runBlock:^{
        [self stop];
    }];
    
    SKAction *turnX = [SKAction runBlock:^{
        if (diff.x > 0) {
            _direction = SJCharacterDirectionRight;
        } else if (diff.x < 0){
            _direction = SJCharacterDirectionLeft;
        }
    }];
    SKAction *turnY = [SKAction runBlock:^{
        if (diff.y > 0) {
            _direction = SJCharacterDirectionUp;
        } else if (diff.y < 0){
            _direction = SJCharacterDirectionDown;
        }
    }];
    
    [actions addObject:turnX];
    [actions addObject:walk];
    [actions addObject:moveX];

    [actions addObject:turnY];
    [actions addObject:walk];
    [actions addObject:moveY];
    
    [actions addObject:stop];
    
    SKAction *sequence = [SKAction sequence:actions];
    
    [self runAction:sequence withKey:MOVE_KEY];
}
{% endhighlight %}

これでキャラクターが歩けるようになりました。

ソースコードは、[sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)です。

まだまだ続きます。

[^1]: physicsBodyを設定した物体同士はデフォルトで衝突するため、プレイヤーは`x`のマスに移動できない。
