<?php

namespace AppBundle\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DashboardController extends Controller
{

	/**
	 * @Route("/admin/dashboard", name="dashboard")
	 * @return Response
	 */
	public function indexAction()
	{
		/*return $this->render( 'dashboard.html.twig', [
			'name' => $slug
		]);*/
		return $this->render( 'admin/dashboard.html.twig');
	}



}