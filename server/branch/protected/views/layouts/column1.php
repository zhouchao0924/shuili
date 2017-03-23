<?php /* @var $this Controller */ ?>
<?php $this->beginContent($this->main); ?>
<div id="header">
    <?php
	    if($this->pageHeader['show']){
	        $this->widget("application.vendor.SiteHeader",$this->pageHeader);
	    }
    ?>
</div>
<div id="content">
	<?php echo $content; ?>
</div><!-- content -->
<div id="footer">
    <?php
	    if($this->pageFooter['show']){
	        $this->widget("application.vendor.SiteFooter",$this->pageFooter);
	    }
    ?>
</div>
<?php $this->flushScriptFiles();?>
<?php $this->endContent(); ?>