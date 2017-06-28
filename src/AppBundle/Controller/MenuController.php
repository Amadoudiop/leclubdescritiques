<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Menu;
use AppBundle\Entity\Link;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
// Json handler
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Menu controller.
 *
 * @Route("admin/menu")
 */
class MenuController extends Controller
{
    /**
     * Lists all menu entities.
     *
     * @Route("s/", name="menu_index")
     * @Method({"GET", "POST"})
     */
    public function indexAction(Request $request)
    {
        //
        $menu = new Menu();
        $newForm = $this->createForm('AppBundle\Form\MenuType', $menu);
        $newForm->handleRequest($request);

        // on submit new form
        if ($newForm->isSubmitted() && $newForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($menu);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Menu Added'
            );
            return $this->redirectToRoute('menu_show', array('id' => $menu->getId()));
        }

        // Get list of menu
        $em = $this->getDoctrine()->getManager();
        $menus = $em->getRepository('AppBundle:Menu')->findAll();


        return $this->render('menu/index.html.twig', array(
            'menus' => $menus,
            'newForm' => $newForm->createView(),

        ));
    }

    /**
     * Creates a new menu entity.
     *
     * @Route("/new", name="menu_new")
     * @Method({"GET", "POST"})
     */
    /*public function newAction(Request $request)
    {
        $menu = new Menu();
        $form = $this->createForm('AppBundle\Form\MenuType', $menu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($menu);
            $em->flush();

            return $this->redirectToRoute('menu_show', array('id' => $menu->getId()));
        }

        return $this->render('menu/new.html.twig', array(
            'menu' => $menu,
            'form' => $form->createView(),
        ));
    }*/

    /**
     * Finds and displays a menu entity.
     *
     * @Route("/{id}", name="menu_show", options={"expose"=true})
     * @Method({"GET", "POST"})
     */
    public function showAction(Menu $menu, Request $request)
    {
        // new link
        $newLink = new Link();
        $newForm = $this->createForm('AppBundle\Form\LinkType', $newLink);
        $newForm->handleRequest($request);

        if ($newForm->isSubmitted() && $newForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $newLink->setMenuOrder(999);
            $em->persist($newLink);
            $em->flush();

            // Show notice
            $this->addFlash(
                'notice',
                'Link Added'
            );
            return $this->redirectToRoute('menu_show', array('id' => $newLink->getMenu()->getId()));
        }




        $deleteForm = $this->createDeleteForm($menu);
        $menu_id = $menu->getId();
        /* get link */
        $em = $this->getDoctrine()->getManager();

        $query = $em->getRepository('AppBundle:Link')
                    ->createQueryBuilder('l')
                    ->where('l.menu = :menu')
                    ->setParameter('menu', $menu)
                    ->addOrderBy('l.menu_order', 'ASC')
                    ->getQuery();

        $links = $query->getResult();

        if( $request->getMethod() == 'POST' )
        {
            $order = $request->request->get('sortList');
            $order = explode(',', $order);
            $counter = 0;
            foreach ($order as $link_id) {

                $link = $em->getRepository('AppBundle:Link')->find((int)$link_id);  
                $link->setMenuOrder($counter);

                // update
                $em->persist($link);
                $em->flush();           
                $counter++;   
            }
            $response = $request->request->get('sortList');
            return new JsonResponse($response);
        }


        return $this->render('menu/show.html.twig', array(
            'menu' => $menu,
            'links' => $links,
            'delete_form' => $deleteForm->createView(),
            'newForm' => $newForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing menu entity.
     *
     * @Route("/{id}/edit", name="menu_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Menu $menu)
    {
        $deleteForm = $this->createDeleteForm($menu);
        $editForm = $this->createForm('AppBundle\Form\MenuType', $menu);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('menu_edit', array('id' => $menu->getId()));
        }

        return $this->render('menu/edit.html.twig', array(
            'menu' => $menu,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a menu entity.
     *
     * @Route("/{id}", name="menu_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Menu $menu)
    {
        $form = $this->createDeleteForm($menu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($menu);
            $em->flush();
        }

        return $this->redirectToRoute('menu_index');
    }

    /**
     * Creates a form to delete a menu entity.
     *
     * @param Menu $menu The menu entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Menu $menu)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('menu_delete', array('id' => $menu->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
