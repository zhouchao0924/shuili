<?php /* @var $this Controller */ ?>
<?php $this->beginContent('/layouts/main'); ?>
<div id="content">
	<?php echo $content; ?>
</div><!-- content -->
<?php $this->flushScriptFiles();?>
<?php $this->endContent(); ?>