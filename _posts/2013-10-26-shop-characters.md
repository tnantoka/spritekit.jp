---
layout: post
title:  "お店の中に他のキャラクターを登場させる"
categories: rpg
author: tnantoka
---

今日はマップ内に他のキャラクターを表示してみます。

前回はSJCharacgterNodeの中に定数でいろいろと持たせていましたが、
`characters.json`というファイルで定義するようにしました。[^1]

{% highlight sh %}
{
    "default" : {
        "stop_time" : 0.6,
        "walk_time" : 0.3,
        "speed": 0.2
    },
    "c0" : {
        "name" : "clotharmor",
        "stop_row" : 0,
        "stop_cols" : 2,
        "walk_row" : 1,
        "walk_cols" : 4,
        "up_row" : 3,
        "right_row" : 6,
        "left_row" : 6,
        "size": 64
    },
    "c1" : {
        "name" : "scientist",
        "stop_row" : 0,
        "stop_cols" : 2,
        "walk_row" : 0,
        "walk_cols" : 2,
        "up_row" : 0,
        "right_row" : 0,
        "left_row" : 0,
        "size": 48
    },
    "c2" : {
        "name" : "chest",
        "stop_row" : 0,
        "stop_cols" : 1,
        "walk_row" : 0,
        "walk_cols" : 1,
        "up_row" : 0,
        "right_row" : 0,
        "left_row" : 0,
        "size": 32
    }
}
{% endhighlight %}

マップデータでどこに配置するか指定します。

{% highlight sh %}
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,c2,c1,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-
-,-,-,-,c0,-,-,-,-,-
{% endhighlight %}

SJMapNode内で、cから始まるデータの場合はキャラクターを生成するようにします。

{% highlight objc %}
} else if ([col hasPrefix:@"c"]) {
    tileSprite = [[SJCharacterNode alloc] initWithCharacterNamed:col];

    tileSprite.physicsBody = [SKPhysicsBody bodyWithRectangleOfSize:CGSizeMake(TILE_SIZE, TILE_SIZE)];
    tileSprite.physicsBody.affectedByGravity = NO;
    tileSprite.physicsBody.allowsRotation = NO;

    tileSprite.name = col;

} 
{% endhighlight %}

SJCharacterNodeではjsonから設定を読み取ります。
この値を定数の代わりに使います。

{% highlight objc %}
- (id)initWithCharacterNamed:(NSString *)name {
    
    NSString *path = [[NSBundle mainBundle] pathForResource:CHARACTERS_NAME ofType:@"json"];
    NSData *data = [NSData dataWithContentsOfFile:path];
    NSError *error = nil;
    NSDictionary *characters = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
    if (error) {
        NSLog(@"%@", [error localizedDescription]);
    }
    NSMutableDictionary *character = [characters[@"default"] mutableCopy];

    [character addEntriesFromDictionary:characters[name]];

    CGFloat size = [character[@"size"] floatValue];
    
    if (self = [super initWithColor:nil size:CGSizeMake(size, size)]) {
        _character = character;
        [self createNodeContents];
    }
    return self;
}
{% endhighlight %}

完成です。

{% include image.html path="posts/shop-characters" caption="ひとりじゃない" %}

相変わらず全然お店ではないですが、見た目はゲームっぽくなってきました。

次は会話を実装する予定です。

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

[^1]: Objective-C的にはplistを使うのが定石だと思いますが、個人的にplistが苦手なのでここではJSONにしています。
