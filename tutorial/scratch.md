---
layout: tutorial
title: scratch
---

前の章では、Sprite Kitによる開発の雰囲気をつかむため、Xcodeに用意されている`SpriteKit Game`テンプレートからプロジェクトを作成し、動作させました。
しかし、このテンプレートはStoryboardsの使用が前提[^1]であり、そうでない場合はファイルを削除する等の手間がかかります。

そこで、この章では`Empty Application`テンプレートをベースに、一からSprite Kitのプロジェクトを作ってみます。
少し面倒に感じるかもしれませんが、自分でプロジェクトをセットアップすることで、理解にも繋がるでしょう。

なお、本チュートリアルでは、特にStoryboardsの機能を使わないため、次章以降もこちらの方法を用います。

### プロジェクト作成

まず、`Empty Application`を選択して、プロジェクトを作成します。なお、プロジェクト名は`SJScratch`にしています。
{% include image.html path="tutorial/scratch/empty" caption="Empty Application" %}

この状態で実行すると、真っ白の画面が表示されます。
{% include image.html path="tutorial/scratch/blank" caption="何もない画面" %}

また、
> Application windows are expected to have a root view controller at the end of application launch
という警告も表示されます。

プロジェクト構成は、以下のようにかなりシンプルです。

{% highlight sh %}
SJScratch/
├── SJScratch
│   ├── Images.xcassets
│   │   ├── AppIcon.appiconset
│   │   │   └── Contents.json
│   │   └── LaunchImage.launchimage
│   │       └── Contents.json
│   ├── SJAppDelegate.h
│   ├── SJAppDelegate.m
│   ├── SJScratch-Info.plist
│   ├── SJScratch-Prefix.pch
│   ├── en.lproj
│   │   └── InfoPlist.strings
│   └── main.m
├── SJScratch.xcodeproj
│   ├── project.pbxproj
│   ├── project.xcworkspace
│   │   ├── contents.xcworkspacedata
│   │   └── xcuserdata
│   │       └── tnantoka.xcuserdatad
│   │           └── UserInterfaceState.xcuserstate
│   └── xcuserdata
│       └── tnantoka.xcuserdatad
│           └── xcschemes
│               ├── SJScratch.xcscheme
│               └── xcschememanagement.plist
└── SJScratchTests
    ├── SJScratchTests-Info.plist
    ├── SJScratchTests.m
    └── en.lproj
        └── InfoPlist.strings
{% endhighlight %}

### フレームワークの追加

*Build phases*の*Link Binary With Libraries*から`SpriteKit.framework`を追加します。

{% include image.html path="tutorial/scratch/spritekit" caption="SpriteKit.framework" %}

Sprite Kitの機能を利用する際は、

{% highlight objc %}
#import <SpriteKit/SpriteKit.h>
{% endhighlight %}

のようにインポートするのを忘れないようにしましょう。

### View Controller

UIViewControllerのサブクラスである`SJViewController`を作成します。

{% include image.html path="tutorial/scratch/sjviewcontroller" caption="SJViewControllerを作成" %}

{% highlight objc %}
- (void)loadView {
    CGRect applicationFrame = [[UIScreen mainScreen] applicationFrame];
    SKView *skView = [[SKView alloc] initWithFrame:applicationFrame];
    self.view = skView;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
  // Do any additional setup after loading the view.
    
    SKView *skView = (SKView *)self.view;
    skView.showsDrawCount = YES;
    skView.showsNodeCount = YES;
    skView.showsFPS = YES;
    
    SKScene *scene = [SKScene sceneWithSize:self.view.bounds.size];
    [skView presentScene:scene];
}
{% endhighlight %}

`loadView`をオーバーライドし、self.viewに**SKView**のインスタンスを設定します。また`viewDidLoad`では、描画数・ノード数・FPSの表示設定とシーンの作成・表示を行なっています。[^2]

#### App Delegate

AppDelegateでは、先ほど作成した*SJViewController*のインスタンスを*UIWindow*の`rootViewController`として設定して、アプリ起動時に表示させます。

{% highlight objc %}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    // Override point for customization after application launch.
    //self.window.backgroundColor = [UIColor whiteColor]; // 削除
    SJViewController *sjViewController = [[SJViewController alloc] init];
    _window.rootViewController = sjViewController;
    [self.window makeKeyAndVisible];
    return YES;
}
{% endhighlight %}

ここまでできたら実行してみましょう。

単色背景の上にFPSなどが表示されており、Sprite Kitで動いていることがわかります。
また、rootViewControllerを指定したため、冒頭の警告ログも表示されないようになっています。

{% include image.html path="tutorial/scratch/run" caption="Sprite Kitによる表示" %}

このように、テンプレートに頼らなくてもほんの少しの手間で、Sprite Kitを用いたプロジェクトを作成することができます。

[^1]: Xcode 5では他のテンプレートも基本的にStoryboardsの使用が前提になっています。
[^2]: ここではSKSceneを直接インスタンス化していますが、実際のゲーム開発では、画面に応じたサブクラスを作成するのが普通です。

