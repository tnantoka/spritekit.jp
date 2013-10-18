---
layout: tutorial
title: hello
date: 2013-10-10 00:00:00 +0900
---

本章ではSprite Kitを用いた開発の流れを体験します。所謂*hello, world*です。

Xcode 5には、`SpriteKit Game`テンプレートが用意されているため、プロジェクト作成時にそれを選択すれば、簡単にSprite Kitを利用することができます。
なお、プロジェクトがシンプルになるよう、ここではデバイスは`iPhone`のみにします。
{% include image.html path="tutorial/hello/template" caption="SpriteKit Game テンプレート" %}
{% include image.html path="tutorial/hello/iphone" caption="デバイス選択" %}

デフォルトの状態で動作するようになっていますので、そのまま実行してみましょう。

ブルーグレーの背景に**Hello, World!**という文字が表示されます。
また、画面をタップするとその場所にスペースシップが表示されて、回転し続けます。

テンプレートに実装されている機能はこれだけですが、文字・画像の表示、アニメーションなどSprite Kitの基本的な使い方を知ることができます。
{% include image.html path="tutorial/hello/hello" caption="Hello, World!と表示" %}
{% include image.html path="tutorial/hello/spaceship" caption="スペースシップ" %}

プロジェクトの中身を見ていきましょう。

構成は以下のとおりです。

{% highlight sh %}
SJHello/
├── SJHello
│   ├── Base.lproj
│   │   └── Main.storyboard
│   ├── Images.xcassets
│   │   ├── AppIcon.appiconset
│   │   │   └── Contents.json
│   │   └── LaunchImage.launchimage
│   │       └── Contents.json
│   ├── SJAppDelegate.h
│   ├── SJAppDelegate.m
│   ├── SJHello-Info.plist
│   ├── SJHello-Prefix.pch
│   ├── SJMyScene.h
│   ├── SJMyScene.m
│   ├── SJViewController.h
│   ├── SJViewController.m
│   ├── Spaceship.png
│   ├── en.lproj
│   │   └── InfoPlist.strings
│   └── main.m
├── SJHello.xcodeproj
│   ├── project.pbxproj
│   ├── project.xcworkspace
│   │   ├── contents.xcworkspacedata
│   │   └── xcuserdata
│   │       └── tnantoka.xcuserdatad
│   │           └── UserInterfaceState.xcuserstate
│   └── xcuserdata
│       └── tnantoka.xcuserdatad
│           └── xcschemes
│               ├── SJHello.xcscheme
│               └── xcschememanagement.plist
└── SJHelloTests
    ├── SJHelloTests-Info.plist
    ├── SJHelloTests.m
    └── en.lproj
        └── InfoPlist.strings
{% endhighlight %}

次にソースのポイントとなる部分を見ていきます。

#### SJAppDelegate.m[^1]

まずは、AppDelegateです。

{% highlight objc %}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    return YES;
}
{% endhighlight %}

ご覧のとおり、特に何もしていません。Storyboardsを利用した普通のプロジェクトと同じです。

#### SJViewController.m

次にViewControllerを見てみましょう。

{% highlight objc %}
- (void)viewDidLoad
{
    [super viewDidLoad];

    // Configure the view.
    SKView * skView = (SKView *)self.view;
    skView.showsFPS = YES;
    skView.showsNodeCount = YES;
    
    // Create and configure the scene.
    SKScene * scene = [SJMyScene sceneWithSize:skView.bounds.size];
    scene.scaleMode = SKSceneScaleModeAspectFill;
    
    // Present the scene.
    [skView presentScene:scene];
}
{% endhighlight %}

`// Configure the view`の部分では、self.viewを**SKView**にキャストして、FPSと描画ノード数を表示する設定をしています。
**SKView**はUIViewのサブクラスで、Sprite Kitのコンテンツ表示用のViewです。

以下のとおり、Storyboard上で、*View Controller*の*View*の*Custom Class*が`SKView`に設定されています。
{% include image.html path="tutorial/hello/skview" caption="Identity inspectorのCustom Class項目" %}

`// Create and configure the scene.`では、**SKScene**のサブクラスである`SJMyScene`のインスタンスを作成しています。
**SKScene**はSprite Kitのゲームの1画面に対応します。

`// Present the scene.`では先ほど作成したシーンのインスタンスをSKViewに設定し、画面に表示しています。

#### SJMyScene.m

最後にシーンです。

{% highlight objc %}
-(id)initWithSize:(CGSize)size {    
    if (self = [super initWithSize:size]) {
        /* Setup your scene here */
        
        self.backgroundColor = [SKColor colorWithRed:0.15 green:0.15 blue:0.3 alpha:1.0];
        
        SKLabelNode *myLabel = [SKLabelNode labelNodeWithFontNamed:@"Chalkduster"];
        
        myLabel.text = @"Hello, World!";
        myLabel.fontSize = 30;
        myLabel.position = CGPointMake(CGRectGetMidX(self.frame),
                                       CGRectGetMidY(self.frame));
        
        [self addChild:myLabel];
    }
    return self;
}

-(void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    /* Called when a touch begins */
    
    for (UITouch *touch in touches) {
        CGPoint location = [touch locationInNode:self];
        
        SKSpriteNode *sprite = [SKSpriteNode spriteNodeWithImageNamed:@"Spaceship"];
        
        sprite.position = location;
        
        SKAction *action = [SKAction rotateByAngle:M_PI duration:1];
        
        [sprite runAction:[SKAction repeatActionForever:action]];
        
        [self addChild:sprite];
    }
}
{% endhighlight %}

イニシャライザでは、


* `backgroundColor`をブルーグレーに設定
* `Hello, World!`と表示する**SKLabelNode**を作成して、子ノードとして追加


しています。

**SKLabelNode**は、その名の通りテキストを表示するためのクラスです。
なお、Sprite Kit上で表示されるものは、全てSKNodeのサブクラスとして用意[^2]されています。
この他に、動画を表示するSKVideoNodeなど、様々な種類があります。

`touchesBegan:withEvent:`では、タップされた座標を設定した**SKSpriteNode**を作成して追加しています。

**SKSpriteNode**は、画像等を表示するクラスです。ここでは画像としてテンプレート内にある`Spaceship.png`が使用されています。
**SKAction**クラスを使ってアニメーション設定されています。360度つまり1回転を、1秒かけて行ない、それを永遠に繰り返す指定がされています。

ここまで、`SpriteKit Game`テンプレートに実装されている、主なソースを見てきました。
シンプルなコードで、文字や画像の表示から、アニメーションまで簡単にできることを感じていただけたでしょうか。

Sprite Kitでは、このようにゲームの画面であるSKSceneを作り、そこに様々なNodeを追加し、それをSKView上に表示することでゲームを作り上げていきます。

[^1]:本チュートリアルではClass Prefixとして`SJ`を用います。
[^2]:SKScene自身も画面に表示されるものであり、SKNodeのサブクラスです。
