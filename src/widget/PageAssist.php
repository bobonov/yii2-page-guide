<?php

namespace matejch\pageGuide\widget;

use matejch\pageGuide\assets\PGuideAsset;
use matejch\pageGuide\models\PageGuide;
use Yii;
use yii\base\Widget;
use yii\helpers\Json;

class PageAssist extends Widget
{
    public $btnPositionCss;

    public $element = null;

    public function init()
    {
        parent::init();

        \Yii::setAlias('@matejch/pageGuide',__DIR__. '/..');

        $this->registerTranslations();
    }

    public function run()
    {
        parent::run();

        $guide = PageGuide::findOne(['url' => '/'.\Yii::$app->request->pathInfo]);

        $view = $this->getView();
        if(isset($guide->rules) && !empty($guide->rules)) {
            $labels = Json::encode([
                'prevLabel' => Yii::t('pageGuide/view','prev'),
                'nextLabel' => Yii::t('pageGuide/view','next'),
                'skipLabel' => Yii::t('pageGuide/view','skip'),
                'doneLabel' => Yii::t('pageGuide/view','done')
            ]);
            $view->registerJs("window.guideRules=$guide->rules;window.guideLabels=$labels");
        }

        PGuideAsset::register($view);

        if(!$guide) { return false; }

        return $this->render('_assist',['rules' => $guide->rules,'btnPositionCss' => $this->btnPositionCss]);
    }

    public function registerTranslations()
    {
        if (Yii::$app->has('i18n')) {
            Yii::$app->i18n->translations['pageGuide/*'] = [
                'class'          => 'yii\i18n\PhpMessageSource',
                'sourceLanguage' => 'en',
                'forceTranslation' => true,
                'basePath'       => '@matejch/pageGuide/messages',
                'fileMap' => [
                    'pageGuide/view' => 'view.php',
                    'pageGuide/model' => 'model.php',
                ],
            ];
        }
    }
}