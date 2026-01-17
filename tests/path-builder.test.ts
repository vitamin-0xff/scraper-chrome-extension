import { describe, it, expect, beforeEach } from 'vitest'
import { extractTextPaths } from '../src/utils/tree-builder'

describe('extractTextPaths', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('extracts text and paths from simple DOM', () => {
    document.body.innerHTML = `
<article class="product-miniature js-product-miniature col-xs-12 propadding" data-id-product="88206" data-id-product-attribute="0" itemscope="" itemtype="http://schema.org/Product">
    <div class="thumbnail-container text-xs-center">
          <div class="wb-image-block col-lg-3 col-xl-3 col-md-4 col-sm-4 col-xs-6">
        
                      <a href="https://www.tunisianet.com.tn/pc-portable-tunisie/88206-pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.html" class="thumbnail product-thumbnail first-img">
              <img class="center-block img-responsive" src="https://www.tunisianet.com.tn/440551-home/pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.jpg" title="301" alt="Pc Portable Lenovo IdeaPad..." data-full-size-image-url="https://www.tunisianet.com.tn/440551-large/pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.jpg" width="250" height="250">              
                                                                                             <img class="second-img img-responsive center-block" src="https://www.tunisianet.com.tn/440550-home/pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.jpg" alt="" title="" itemprop="image" width="250" height="250">
                                                                                        </a>
                              <input type="hidden" id="hit_ref13" value="82LX00ECFG">
          <input type="hidden" id="hit_id13" value="88206">
          <input type="hidden" id="hit_qte13" value="-4">  
        
        
        
          <ul class="product-flags">
                      </ul>
        
        
      </div>
      
      <div class="wb-product-desc product-description col-lg-5 col-xl-5 col-md-6 col-sm-6 col-xs-6">
        <div class="progre">
          
          	
          
        </div>
        
        
                    	<h2 class="h3 product-title" itemprop="name"><a href="https://www.tunisianet.com.tn/pc-portable-tunisie/88206-pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.html">Pc Portable Lenovo IdeaPad 1 15IJL7 / Celeron N4500 / 8 Go / 256 Go SSD / Gris</a></h2>
            <span class="product-reference">[82LX00ECFG]</span>
                  
                
        	<div id="product-description-short-88206" itemprop="description" class="listds">
            <a href="https://www.tunisianet.com.tn/pc-portable-tunisie/88206-pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.html">
            	<span style="font-size:10pt;color:#d0121a;"><strong>Écran 15.6" HD (1366x768), antireflet</strong></span> - Processeur <span style="font-size:10pt;color:#d0121a;"><strong>Intel Celeron N4500</strong></span>, (jusqu’à 2.8 GHz,&nbsp;4 Mo de mémoire cache) - Mémoire <span style="font-size:10pt;color:#d0121a;"><strong>8 Go DDR4</strong></span> - Disque SSD <span style="font-size:10pt;color:#d0121a;"><strong>M.2 NVMe 256 Go</strong></span> - Carte graphique <span style="font-size:10pt;color:#d0121a;"><strong>Intel UHD Graphics intégrée</strong></span> - Lecteur de carte SD - 2x Haut-parleurs stéréo 1.5 W, Dolby Audio - Caméra HD 720p avec obturateur de confidentialité - <span style="font-size:10pt;color:#d0121a;"><strong>Wi-Fi 6</strong></span> - Bluetooth 5.2 - 1x USB 2.0 - 1x USB 3.2 - 1x USB-C 3.2 - 1x HDMI 1.4b - 1x prise combinée casque/microphone (3.5 mm) - <span style="font-size:10pt;color:#d0121a;"><strong>FreeDos</strong></span>&nbsp;- Couleur&nbsp;Gris - <span style="font-size:10pt;color:#d0121a;"><strong>Garantie 1 an Avec Sacoche Lenovo</strong></span>
                          </a>
            <p class="ff_p_field" id="hit_1mvt13"></p>
        		<p class="ff_p_field" id="hit_2mvt13"></p>   
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last11w13"></div>
              <div class="ff_div_field" id="hit_8last12w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last21w13"></div>
              <div class="ff_div_field" id="hit_8last22w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last31w13"></div>
              <div class="ff_div_field" id="hit_8last32w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last41w13"></div>
              <div class="ff_div_field" id="hit_8last42w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last51w13"></div>
              <div class="ff_div_field" id="hit_8last52w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last61w13"></div>
              <div class="ff_div_field" id="hit_8last62w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last71w13"></div>
              <div class="ff_div_field" id="hit_8last72w13"></div>
            </div>
            <div id="hit_8lastw13" class="ff_div col-lg-18 col-xl-18 col-md-18 col-sm-3 col-xs-3">
              <div class="ff_div_field" id="hit_8last81w13"></div>
              <div class="ff_div_field" id="hit_8last82w13"></div>
            </div>
          </div>
         
        
        <!--Logo Marque-->
                  <div class="product-manufacturer">
                          <a href="https://www.tunisianet.com.tn/3_lenovo">
                <img src="https://www.tunisianet.com.tn/img/m/3.jpg" class="img img-thumbnail manufacturer-logo" alt="Lenovo">
              </a>
                      </div>
                <!--Fin Logo Marque-->

        
        	<div id="stock_availability">
                          <span class="in-stock">En stock</span>
                      </div>
        
        
        
                      <div class="product-price-and-shipping">
              <span itemprop="price" class="price">869,000 DT</span>
                            
                            
              <span class="sr-only">Prix</span> 
                          
            </div>
                  
                
        <div class="button-group">        
          <div class="topbtn">
            <div class="button-container cart add-cart">
	<form action="https://www.tunisianet.com.tn/panier" method="post">
		<input type="hidden" name="token" value="898389d4a5ba0937a5c39f555e4ec5c3">
		<input type="hidden" value="-4" class="quantity_product quantity_product_88206" name="quantity_product">
		<input type="hidden" value="1" class="minimal_quantity minimal_quantity_88206" name="minimal_quantity">
		<input type="hidden" value="0" class="id_product_attribute id_product_attribute_88206" name="id_product_attribute">
		<input type="hidden" value="88206" class="id_product" name="id_product">
		<input type="hidden" name="id_customization" value="" class="product_customization_id">
			
		<input type="hidden" class="input-group form-control qty qty_product qty_product_88206" name="qty" value="1" data-min="1">
		  <button title="Chariot" class="cartb  btn-product add-to-cart wb-bt-cart wb-bt-cart_88206 wb-enable" data-button-action="add-to-cart" type="submit">
									 <svg width="16px" height="16px"><use xlink:href="#bcart"></use></svg><span class="pcart">Ajouter au panier</span>
		  </button>
	</form>
</div>



            <div class="wishlist">	
		<a class="wish wb-wishlist-button btn-product btn" href="javascript:void(0)" data-id-wishlist="" data-id-product="88206" data-id-product-attribute="0" title="Liste de souhaits">
									<span class="pwish">
                    <svg width="16px" height="16px"><use xlink:href="#heart"></use></svg> <span>Favoris</span>
            </span>
		</a>	
</div>
            <div class="compare">
	<a class="wb-compare-button btn-product btn" href="javascript:void(0)" data-id-product="88206" title="Comparer">
				<span class="wb-compare-content">
			<svg width="16px" height="16px"><use xlink:href="#compare"></use></svg>
			<span>Comparer</span>
		</span>
	</a>
</div>
            
              <a class="quick-view pquick btn" href="#" data-link-action="quickview">
              <svg width="16px" height="16px"><use xlink:href="#bquick"></use></svg>
              </a>
                    
          </div>
        </div>
      </div>
      
      <div id="productList-availability-store" class="productList-availability-store">
                  <div class="store-availability-intro">Disponibilité</div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 stores">
            <div class="store-availability-list stock" title="Disponible magasin Tunis">Boutique Tunis</div>
            <div class="store-availability-list stock" title="Disponible magasin Sousse">Sousse</div>
            <div class="store-availability-list stock" title="Disponible magasin Sfax">Sfax</div>
            <div class="store-availability-list hstock" title="Non disponible Drive-in Charguia">Tunis Drive-IN</div>
          </div>
              </div>
            
      <div class="wb-action-block col-lg-2 col-xl-2 col-md-2 col-sm-2 col-xs-12">      	
        
        	<!--Logo Marque-->
                                <div class="product-manufacturer">
                              <a href="https://www.tunisianet.com.tn/3_lenovo">
                  <img src="https://www.tunisianet.com.tn/img/m/3.jpg" class="img img-thumbnail manufacturer-logo" alt="Lenovo">
                </a>
                          </div>
                    <!--Fin Logo Marque-->
        
        
                      <div class="product-price-and-shipping">
              <span itemprop="price" class="price">869,000 DT</span>
                            
                            
              <span class="sr-only">Prix</span> 
                        
            </div>
                  
        <div id="hit_price13" class="ff_price_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
        </div>
        
        	<div id="stock_availability">
                          <span class="in-stock">En stock</span>
                      </div>
                  
        
          <div class="button-group">        
            <div class="topbtn">
              <div class="button-container cart add-cart">
	<form action="https://www.tunisianet.com.tn/panier" method="post">
		<input type="hidden" name="token" value="898389d4a5ba0937a5c39f555e4ec5c3">
		<input type="hidden" value="-4" class="quantity_product quantity_product_88206" name="quantity_product">
		<input type="hidden" value="1" class="minimal_quantity minimal_quantity_88206" name="minimal_quantity">
		<input type="hidden" value="0" class="id_product_attribute id_product_attribute_88206" name="id_product_attribute">
		<input type="hidden" value="88206" class="id_product" name="id_product">
		<input type="hidden" name="id_customization" value="" class="product_customization_id">
			
		<input type="hidden" class="input-group form-control qty qty_product qty_product_88206" name="qty" value="1" data-min="1">
		  <button title="Chariot" class="cartb  btn-product add-to-cart wb-bt-cart wb-bt-cart_88206 wb-enable" data-button-action="add-to-cart" type="submit">
									 <svg width="16px" height="16px"><use xlink:href="#bcart"></use></svg><span class="pcart">Ajouter au panier</span>
		  </button>
	</form>
</div>



              <div class="wishlist">	
		<a class="wish wb-wishlist-button btn-product btn" href="javascript:void(0)" data-id-wishlist="" data-id-product="88206" data-id-product-attribute="0" title="Liste de souhaits">
									<span class="pwish">
                    <svg width="16px" height="16px"><use xlink:href="#heart"></use></svg> <span>Favoris</span>
            </span>
		</a>	
</div>
              <div class="compare">
	<a class="wb-compare-button btn-product btn" href="javascript:void(0)" data-id-product="88206" title="Comparer">
				<span class="wb-compare-content">
			<svg width="16px" height="16px"><use xlink:href="#compare"></use></svg>
			<span>Comparer</span>
		</span>
	</a>
</div>
              
                <a class="quick-view pquick btn" href="#" data-link-action="quickview">
                <svg width="16px" height="16px"><use xlink:href="#bquick"></use></svg>
                </a>
                      
            </div>
          </div>
        
        <!--<input type="text" id="hit_qteserv13" value="" style="display:none" class="ff_input_field" disabled="disabled" />-->
                  <div id="hit_stockdep0_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep01d13">
              <input type="text" id="hit_depserv0_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep02d13">
              <input type="text" id="hit_qteserv0_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep1_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep11d13">
              <input type="text" id="hit_depserv1_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep12d13">
              <input type="text" id="hit_qteserv1_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep2_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep21d13">
              <input type="text" id="hit_depserv2_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep22d13">
              <input type="text" id="hit_qteserv2_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep3_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep31d13">
              <input type="text" id="hit_depserv3_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep32d13">
              <input type="text" id="hit_qteserv3_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep4_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep41d13">
              <input type="text" id="hit_depserv4_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep42d13">
              <input type="text" id="hit_qteserv4_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep5_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep51d13">
              <input type="text" id="hit_depserv5_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep52d13">
              <input type="text" id="hit_qteserv5_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep6_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep61d13">
              <input type="text" id="hit_depserv6_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep62d13">
              <input type="text" id="hit_qteserv6_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep7_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep71d13">
              <input type="text" id="hit_depserv7_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep72d13">
              <input type="text" id="hit_qteserv7_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep8_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep81d13">
              <input type="text" id="hit_depserv8_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep82d13">
              <input type="text" id="hit_qteserv8_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep9_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep91d13">
              <input type="text" id="hit_depserv9_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep92d13">
              <input type="text" id="hit_qteserv9_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep10_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep101d13">
              <input type="text" id="hit_depserv10_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep102d13">
              <input type="text" id="hit_qteserv10_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep11_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep111d13">
              <input type="text" id="hit_depserv11_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep112d13">
              <input type="text" id="hit_qteserv11_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep12_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep121d13">
              <input type="text" id="hit_depserv12_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep122d13">
              <input type="text" id="hit_qteserv12_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep13_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep131d13">
              <input type="text" id="hit_depserv13_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep132d13">
              <input type="text" id="hit_qteserv13_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep14_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep141d13">
              <input type="text" id="hit_depserv14_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep142d13">
              <input type="text" id="hit_qteserv14_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep15_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep151d13">
              <input type="text" id="hit_depserv15_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep152d13">
              <input type="text" id="hit_qteserv15_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep16_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep161d13">
              <input type="text" id="hit_depserv16_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep162d13">
              <input type="text" id="hit_qteserv16_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep17_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep171d13">
              <input type="text" id="hit_depserv17_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep172d13">
              <input type="text" id="hit_qteserv17_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep18_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep181d13">
              <input type="text" id="hit_depserv18_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep182d13">
              <input type="text" id="hit_qteserv18_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep19_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep191d13">
              <input type="text" id="hit_depserv19_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep192d13">
              <input type="text" id="hit_qteserv19_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
                  <div id="hit_stockdep20_13" class="ff_sd_div col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12" style="display:none">
            <div class="ff_sd_div_field" id="hit_stockdep201d13">
              <input type="text" id="hit_depserv20_13" value="" class="ff_sd_input_field" disabled="disabled">
            </div>
            <div class="ff_sd_div_field" id="hit_stockdep202d13">
              <input type="text" id="hit_qteserv20_13" value="" class="ff_sd_input_field" style="text-align:center" disabled="disabled">
            </div>
          </div>
            		<a id="hit_link13" class="ff_link_field" target="_blank" href=""></a>
      </div>
        <div id="productList-availability-store-mobile" class="productList-availability-store-mobile">
              <div class="store-availability-intro">Disponibilité</div>
        <div class="col-lg-2 col-xl-2 col-md-2 col-sm-2 col-xs-12 stores">
          <div class="store-availability-list stock" title="Disponible magasin Tunis">Boutique Tunis</div>
          <div class="store-availability-list stock" title="Disponible magasin Sousse">Sousse</div>
          <div class="store-availability-list stock" title="Disponible magasin Sfax">Sfax</div>
          <div class="store-availability-list hstock" title="Non disponible Drive-in Charguia">Tunis Drive-IN</div>
        </div>
          </div>
        </div>
  </article>
    `

    const result = extractTextPaths(document.body)
    console.log(result)
  })

  it('includes nested text elements', () => {
    document.body.innerHTML = `
      <div>
        <span>
          Text
          <b>Bold</b>
        </span>
      </div>
    `

    const result = extractTextPaths(document.body)
    console.log(result)
    expect(result).toEqual([
      {
        text: 'Text Bold',
        path: 'body:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)'
      },
      {
        text: 'Bold',
        path: 'body:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) > b:nth-of-type(1)'
      }
    ])
  })

  it('skips elements without visible text', () => {
    document.body.innerHTML = `
      <div>
        <span></span>
        <span>Visible</span>
      </div>
    `

    const result = extractTextPaths(document.body)

    expect(result).toHaveLength(1)
    expect(result[0].text).toBe('Visible')
  })

  it('skips script and style elements', () => {
    document.body.innerHTML = `
      <div>
        <script>console.log("x")</script>
        <style>.a { color: red }</style>
        <span>Text</span>
      </div>
    `

    const result = extractTextPaths(document.body)

    expect(result).toEqual([
      {
        text: 'Text',
        path: 'body:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)'
      }
    ])
  })

  it('skips hidden elements', () => {
    document.body.innerHTML = `
      <div>
        <span style="display: none">Hidden</span>
        <span>Visible</span>
      </div>
    `

    const result = extractTextPaths(document.body)

    expect(result).toEqual([
      {
        text: 'Visible',
        path: 'body:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(2)'
      }
    ])
  })

  it('produces deterministic paths', () => {
    document.body.innerHTML = `
      <div>
        <span>A</span>
        <span>B</span>
      </div>
    `

    const first = extractTextPaths(document.body)
    const second = extractTextPaths(document.body)

    expect(first).toEqual(second)
  })
})
