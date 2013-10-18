---
layout: post
title:  "簡易タイルマップでお店風の背景を表示"
categories: rpg
author: tnantoka
---

自作RPGのリリースに向けて開発を進めていきたいと思います。
まずは店風の背景を表示してみます。  

使う素材は、[BrowserQuestのtilesheet.png](https://github.com/browserquest/BrowserQuest/blob/master/client/img/2/tilesheet.png)です。

この画像は、32x32のタイルが縦に20個、横に98個並んだものです。
扱いやすくするためにそれぞれ番号を振ります。

せっかくなのでこれもSprite Kitでやります。

{% highlight objc %}
static const CGFloat TILE_SIZE = 32.0f;
static const CGFloat SCALE = 0.75f;

static NSString * const BG_NAME = @"bg";

- (void)createSceneContents {
    self.backgroundColor = [SKColor darkGrayColor];
    
    SKTexture *tilesheet = [SKTexture textureWithImageNamed:@"tilesheet"];
    
    SKSpriteNode *bgSprite = [SKSpriteNode spriteNodeWithTexture:tilesheet];
    bgSprite.xScale = bgSprite.yScale = SCALE;
    bgSprite.anchorPoint = CGPointMake(0, 0);
    bgSprite.name = BG_NAME;
    [self addChild:bgSprite];
    
    NSInteger cols = tilesheet.size.width / TILE_SIZE;
    NSInteger rows = tilesheet.size.height / TILE_SIZE;
    
    for (int i = 0; i < cols; i++) {
        for (int j = 0; j < rows; j++) {
            CGPoint position = CGPointMake(i * TILE_SIZE, j * TILE_SIZE);
            
            SKLabelNode *pointLabel = [SKLabelNode labelNodeWithFontNamed:@""];
            pointLabel.text = [NSString stringWithFormat:@"%d", i + j * cols];
            pointLabel.position = CGPointMake(position.x + TILE_SIZE / 2.0f, position.y + TILE_SIZE / 2.0f);
            pointLabel.fontSize = 14.0f;
            pointLabel.verticalAlignmentMode = SKLabelVerticalAlignmentModeCenter;
            [bgSprite addChild:pointLabel];
        }
    }
}
{% endhighlight %}

透過されている部分がわかりやすいようにSceneに背景色をつけています。

そして、tilesheet.pngからSKSpriteNodeを作成し、anchorPointを左下に設定してSceneに追加します。
そのままだと大きくて見づらいので、xScale・yScaleで調整しています。

その後、32px毎にSKLabelNodeで番号を表示していきます。
これで以下のような画面になります。
{% include image.html path="posts/shop-tile-map/tilesheet" caption="各タイルに番号を" %}

それでは、この番号を使ってマップを作成します。

まずは、マップデータです。
今回はCSVファイルで表現します。

{% highlight sh %}
504,505,506,506,506,507,507,507,508,509
484,485,486,486,486,487,487,487,488,489
464,465,466,466,466,467,467,467,468,469
464,465,466,466,466,467,467,467,468,469
464,465,466,466,466,467,467,467,468,469
464,465,466,466,466,467,467,467,468,469
444,445,446,446,446,447,447,447,448,449
444,445,446,446,446,447,447,447,448,449
444,445,446,446,446,447,447,447,448,449
444,445,446,446,446,447,447,447,448,449
444,445,446,446,446,447,447,447,448,449
424,425,426,-1,446,447,-1,427,428,429
404,405,406,-1,-1,-1,-1,407,408,409

-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
-1,-1,285,286,-1,-1,-1,-1,-1,-1
-1,-1,265,266,-1,-1,-1,-1,-1,-1
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
-1,-1,1124,1125,1125,1125,1125,1126,-1,-1
-1,-1,1104,1105,1105,1105,1105,1106,-1,-1
-1,-1,1104,1105,1105,1105,1105,1106,-1,-1
-1,-1,1104,1105,1105,1105,1105,1106,-1,-1
-1,-1,1084,1085,1085,1085,1085,1086,-1,-1
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
-1,-1,-1,345,346,346,347,-1,-1,-1
-1,-1,-1,325,326,326,327,-1,-1,-1
-1,-1,-1,305,306,306,307,-1,-1,-1
{% endhighlight %}

あとはこれを読み込んで表示するだけです。

{% highlight objc %}
- (void)createSceneContents {
    
    NSString *shop = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"shop" ofType:@"csv"]  encoding:NSUTF8StringEncoding error:nil];
    
    SKTexture *tilesheet = [SKTexture textureWithImageNamed:@"tilesheet"];
    
    NSArray *layers = [shop componentsSeparatedByString:@"\n\n"];
    
    for (NSString *layer in layers) {

        NSArray *rows = [[[layer componentsSeparatedByString:@"\n"] reverseObjectEnumerator] allObjects];
        for (int i = 0; i < rows.count; i++) {
            NSString *row = rows[i];
            NSArray *cols = [row componentsSeparatedByString:@","];
            for (int j = 0; j < cols.count; j++) {
                
                NSInteger col = [cols[j] integerValue];
                
                if (col > -1) {
                    CGFloat x = col % (NSInteger)MAP_COLS * TILE_SIZE / tilesheet.size.width;
                    CGFloat y = col / (NSInteger)MAP_COLS * TILE_SIZE / tilesheet.size.height;
                    CGFloat w = TILE_SIZE / tilesheet.size.width;
                    CGFloat h = TILE_SIZE / tilesheet.size.height;
                    
                    CGRect rect = CGRectMake(x, y, w, h);
                    SKTexture *tile = [SKTexture textureWithRect:rect inTexture:tilesheet];

                    SKSpriteNode *tileSprite = [SKSpriteNode spriteNodeWithTexture:tile];

                    CGPoint position = CGPointMake(j * TILE_SIZE, i * TILE_SIZE);
                    tileSprite.anchorPoint = CGPointMake(0, 0);
                    tileSprite.position = position;

                    [self addChild:tileSprite];
                    
                }
            }
        }

    }
}
{% endhighlight %}

やっていることは単純でCSVを空行区切りでレイヤーにわけて、
あとは順番に、番号に合うタイルを`textureWithRect:inTexture:`使って表示しているだけです。

なお、`-1`は何も表示しないという意味にしています。

これで以下のように表示できます。
{% include image.html path="posts/shop-tile-map/shop" caption="お店？" %}

ゲームに使うには、各タイルの通行可否フラグなど保持したりしないといけないので、
TileクラスやMapクラスが必要になってくると思います。

今日のところは表示するところまで。

ソースコードは、[sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)にあります。

rectの計算で割り切れないことなどが原因で、ノイズが出てしまうのが気になるところ。  
解消できたらまた書きます。

