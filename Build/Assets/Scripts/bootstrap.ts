/**
 * Bootstrap entry — register only the components MPC uses.
 */
import '../Scss/bootstrap.scss'

import Button from 'bootstrap/js/dist/button.js'
import Carousel from 'bootstrap/js/dist/carousel.js'
import Collapse from 'bootstrap/js/dist/collapse.js'
import Combobox from 'bootstrap/js/dist/combobox.js'
import Datepicker from 'bootstrap/js/dist/datepicker.js'
import Dialog from 'bootstrap/js/dist/dialog.js'
import Drawer from 'bootstrap/js/dist/drawer.js'
import Menu from 'bootstrap/js/dist/menu.js'
import Tab from 'bootstrap/js/dist/tab.js'

// Keep component modules (data-api listeners) in the bootstrap bundle.
void [Button, Carousel, Collapse, Combobox, Datepicker, Dialog, Drawer, Menu, Tab]

export { Button, Carousel, Collapse, Combobox, Datepicker, Dialog, Drawer, Menu, Tab }
