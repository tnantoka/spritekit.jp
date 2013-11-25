---
layout: post
title:  "チャプター"
categories: rpg
author: tnantoka
---

章とサブタイトルを表示して次のシーンへ進むだけの単純なもの。

設定ファイルでは表示内容とnextを指定。

#### chapter_1.json
{% highlight js %}
{
    "type" : "chapter",
    "title" : {
        "en" : "CHAPTER 1",
        "ja" : "第一章"
    },
    "subtitle" : {
        "en" : "THE MANIPULATOR & THE SUBSERVIENT",
        "ja" : "利用する者されるもの者"
    },
    "next" : "story_opening"
}
{% endhighlight %}

これを画面に表示して、一定時間まった後次のシーンを読み込む。

#### SJChapterScene.m
{% highlight objc %}
- (void)createSceneContents {
    
    SKLabelNode *titleLabel1 = [SKLabelNode labelNodeWithFontNamed:FONT_NORMAL];
    titleLabel1.text = self.sceneData[@"title"][[SJUtilities lang]];
    titleLabel1.fontSize = 28.0f;
    titleLabel1.position = CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame) + MARGIN);
    titleLabel1.verticalAlignmentMode =SKLabelVerticalAlignmentModeBottom;
    [self addChild:titleLabel1];
    
    SKLabelNode *titleLabel2 = [SKLabelNode labelNodeWithFontNamed:titleLabel1.fontName];
    titleLabel2.text = self.sceneData[@"subtitle"][[SJUtilities lang]];;
    titleLabel2.position = CGPointMake(CGRectGetMidX(self.frame), CGRectGetMidY(self.frame) - MARGIN);
    titleLabel2.fontSize = 20.0f;
    titleLabel2.verticalAlignmentMode =SKLabelVerticalAlignmentModeTop;
    [self addChild:titleLabel2];
    
    self.nextScene = self.sceneData[@"next"];
    [self performSelector:@selector(loadNextScene) withObject:nil afterDelay:DELAY];
}
{% endhighlight %}

できました。

{% include image.html path="posts/rpg-chapter-scene" caption="秀逸なサブタイトル" %}

以上。

ソースコード: [sj-prototype-apps/SJRolePlaying at master · tnantoka/sj-prototype-apps](https://github.com/tnantoka/sj-prototype-apps/tree/master/SJRolePlaying)

